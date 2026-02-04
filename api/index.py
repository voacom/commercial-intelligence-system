from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from typing import Annotated
from pydantic import BaseModel
import sys
import os

# Add current directory to sys.path to allow imports from local files on Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models import User, UserInDB, Token, LoginRequest, DesignProject, CreateProjectRequest, UpdateProjectRequest
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from database import supabase
import os
import dashscope
from http import HTTPStatus
import json
import re
from functools import lru_cache
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from datetime import datetime, timezone

# Load API Key
dashscope.api_key = os.getenv("DASHSCOPE_API_KEY")

class GenerateManualRequest(BaseModel):
    topic: str
    target_audience: str = "Potential Investors"
    industry: str = "General"

app = FastAPI(title="AI Commercial Intelligence Backend")

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

# --- Auth Helper ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_user(email: str):
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        if response.data:
            user_data = response.data[0]
            return UserInDB(
                id=user_data.get("id"),
                email=user_data.get("email"),
                name=user_data.get("name"),
                role=user_data.get("role"),
                company_id=user_data.get("company_id"),
                created_at=user_data.get("created_at"),
                password_hash=user_data.get("password_hash")
            )
    except Exception as e:
        print(f"Error fetching user: {e}")
    return None

# --- Helper to get current user ---
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    from jose import jwt, JWTError
    from auth import SECRET_KEY, ALGORITHM
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = get_user(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
async def api_login(login_data: LoginRequest):
    """
    JSON login endpoint for frontend convenience
    """
    user = get_user(login_data.username)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    return current_user

# --- Project CRUD Endpoints ---

@lru_cache(maxsize=8)
def _postgrest_openapi() -> dict:
    base_url = os.environ.get("SUPABASE_URL")
    api_key = os.environ.get("SUPABASE_KEY")
    if not base_url or not api_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set")

    openapi_url = f"{base_url.rstrip('/')}/rest/v1/?apikey={api_key}"
    req = Request(
        openapi_url,
        headers={
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
        },
        method="GET",
    )
    with urlopen(req, timeout=10) as resp:
        body = resp.read().decode("utf-8")
    return json.loads(body)


def _table_columns(table_name: str) -> set[str]:
    spec = _postgrest_openapi()

    definitions = spec.get("definitions")
    if isinstance(definitions, dict) and table_name in definitions:
        props = definitions.get(table_name, {}).get("properties", {})
        if isinstance(props, dict):
            return set(props.keys())

    components = spec.get("components", {})
    schemas = components.get("schemas", {}) if isinstance(components, dict) else {}
    if isinstance(schemas, dict) and table_name in schemas:
        props = schemas.get(table_name, {}).get("properties", {})
        if isinstance(props, dict):
            return set(props.keys())

    return set()


def _pick_column(columns: set[str], candidates: list[str]) -> str | None:
    for c in candidates:
        if c in columns:
            return c
    return None


def _design_works_mapping() -> dict[str, str | None]:
    cols = _table_columns("design_works")
    return {
        "id": _pick_column(cols, ["id"]),
        "user": _pick_column(cols, ["user_id", "owner_id", "created_by", "author_id", "uid", "project_id"]),
        "type": _pick_column(cols, ["type", "kind", "category"]),
        "title": _pick_column(cols, ["title", "name"]),
        "content": _pick_column(cols, ["content", "data", "payload"]),
        "created_at": _pick_column(cols, ["created_at", "createdAt", "created_time"]),
        "updated_at": _pick_column(cols, ["updated_at", "updatedAt", "updated_time", "modified_at"]),
    }


def _projects_mapping() -> dict[str, str | None]:
    cols = _table_columns("projects")
    return {
        "id": _pick_column(cols, ["id"]),
        "user": _pick_column(cols, ["user_id", "owner_id", "created_by", "author_id", "uid"]),
        "type": _pick_column(cols, ["type", "kind", "category"]),
        "title": _pick_column(cols, ["name", "title"]),
        "content": _pick_column(cols, ["settings", "content", "data", "payload"]),
        "created_at": _pick_column(cols, ["created_at", "createdAt", "created_time"]),
        "updated_at": _pick_column(cols, ["updated_at", "updatedAt", "updated_time", "modified_at"]),
    }


def _project_row_to_api(row: dict, mapping: dict[str, str | None]) -> dict:
    out = {
        "id": row.get(mapping["id"] or "id"),
        "user_id": row.get(mapping["user"] or "user_id"),
        "type": row.get(mapping["type"] or "type"),
        "title": row.get(mapping["title"] or "title"),
        "content": row.get(mapping["content"] or "content"),
        "created_at": row.get(mapping["created_at"] or "created_at"),
        "updated_at": row.get(mapping["updated_at"] or "updated_at"),
    }
    return out


@app.get("/api/design/projects", response_model=list[DesignProject])
async def get_projects(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    try:
        mapping = _projects_mapping()
        user_col = mapping["user"]
        if not user_col:
            raise HTTPException(status_code=500, detail="projects missing user ownership column")

        user_id_str = str(current_user.id)
        query = supabase.table("projects").select("*").eq(user_col, user_id_str)
        if mapping["updated_at"]:
            query = query.order(mapping["updated_at"], desc=True)
        response = query.execute()
        return [_project_row_to_api(r, mapping) for r in (response.data or [])]
    except Exception as e:
        print(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch projects")

@app.post("/api/design/projects", response_model=DesignProject)
async def create_project(
    project: CreateProjectRequest, 
    current_user: Annotated[UserInDB, Depends(get_current_user)]
):
    try:
        print(f"Creating project for user {current_user.id}")
        mapping = _projects_mapping()
        user_col = mapping["user"]
        type_col = mapping["type"]
        title_col = mapping["title"]
        content_col = mapping["content"]

        missing = [k for k, v in [("user", user_col), ("type", type_col), ("title", title_col), ("content", content_col)] if not v]
        if missing:
            raise HTTPException(status_code=500, detail=f"projects missing columns: {', '.join(missing)}")

        new_project = {
            user_col: str(current_user.id),
            type_col: project.type,
            title_col: project.title,
            content_col: project.content,
        }

        response = supabase.table("projects").insert(new_project).execute()
        
        # Print full response for debugging
        # print(f"Supabase response: {response}")

        if response.data:
            return _project_row_to_api(response.data[0], mapping)
            
        print("No data returned from Supabase insert")
        raise HTTPException(status_code=500, detail="Failed to create project: No data returned")
        
    except Exception as e:
        print(f"Error creating project: {e}")
        # Return the actual error message for debugging
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@app.delete("/api/design/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: Annotated[UserInDB, Depends(get_current_user)]
):
    try:
        mapping = _projects_mapping()
        user_col = mapping["user"]
        id_col = mapping["id"] or "id"
        if not user_col:
            raise HTTPException(status_code=500, detail="projects missing user ownership column")

        # Check ownership
        response = supabase.table("projects").select(user_col).eq(id_col, project_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if response.data[0][user_col] != str(current_user.id):
            raise HTTPException(status_code=403, detail="Not authorized to delete this project")
            
        supabase.table("projects").delete().eq(id_col, project_id).execute()
        return {"status": "success", "message": "Project deleted"}
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error deleting project: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete project")

@app.put("/api/design/projects/{project_id}", response_model=DesignProject)
async def update_project(
    project_id: str,
    update_data: UpdateProjectRequest,
    current_user: Annotated[UserInDB, Depends(get_current_user)]
):
    try:
        mapping = _projects_mapping()
        user_col = mapping["user"]
        id_col = mapping["id"] or "id"
        title_col = mapping["title"] or "title"
        content_col = mapping["content"] or "content"
        updated_col = mapping["updated_at"]
        if not user_col:
            raise HTTPException(status_code=500, detail="projects missing user ownership column")

        # Check ownership
        response = supabase.table("projects").select(user_col).eq(id_col, project_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if response.data[0][user_col] != str(current_user.id):
            raise HTTPException(status_code=403, detail="Not authorized to update this project")
        
        updates = {}
        if updated_col:
            updates[updated_col] = datetime.now(timezone.utc).isoformat()
        if update_data.title:
            updates[title_col] = update_data.title
        if update_data.content:
            updates[content_col] = update_data.content
            
        response = supabase.table("projects").update(updates).eq(id_col, project_id).execute()
        if response.data:
            return _project_row_to_api(response.data[0], mapping)
        raise HTTPException(status_code=500, detail="Failed to update project")
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error updating project: {e}")
        raise HTTPException(status_code=500, detail="Failed to update project")

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

def get_user(email: str):
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        if response.data:
            user_data = response.data[0]
            return UserInDB(
                id=user_data.get("id"),
                email=user_data.get("email"),
                name=user_data.get("name"),
                role=user_data.get("role"),
                company_id=user_data.get("company_id"),
                created_at=user_data.get("created_at"),
                password_hash=user_data.get("password_hash")
            )
    except Exception as e:
        print(f"Error fetching user: {e}")
    return None

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = get_user(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
async def api_login(login_data: LoginRequest):
    """
    JSON login endpoint for frontend convenience
    """
    user = get_user(login_data.username)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(token: Annotated[str, Depends(oauth2_scheme)]):
    # In a real app, verify token (decode JWT) and fetch user
    # This is a simplified example where we decode the token to get the username (email)
    from jose import jwt, JWTError
    from auth import SECRET_KEY, ALGORITHM
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = get_user(username)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Feature Endpoints (Mock) ---

import json
import re

from prompts import MANUAL_GENERATION_PROMPT

@app.post("/api/design/manual/generate")
async def generate_manual(request: GenerateManualRequest):
    # This endpoint might not require auth in demo mode, but ideally should.
    # For now, we keep it open or you can add Depends(get_current_user)
    
    prompt = MANUAL_GENERATION_PROMPT.format(
        topic=request.topic,
        industry=request.industry,
        target_audience=request.target_audience
    )
    
    try:
        response = dashscope.Generation.call(
            model=dashscope.Generation.Models.qwen_plus,
            messages=[{'role': 'system', 'content': 'You are a helpful assistant that outputs strict JSON.'},
                      {'role': 'user', 'content': prompt}],
            result_format='message',
        )
        
        if response.status_code == HTTPStatus.OK:
            content_str = response.output.choices[0].message.content
            # Clean up potential markdown code blocks if the model ignores instructions
            content_str = re.sub(r'^```json\s*', '', content_str)
            content_str = re.sub(r'\s*```$', '', content_str)
            
            try:
                slides_data = json.loads(content_str)
            except json.JSONDecodeError:
                # Fallback if JSON is malformed
                print(f"JSON Decode Error. Raw content: {content_str}")
                slides_data = {
                    "slides": [
                        {"title": "Error Parsing AI Response", "content": content_str}
                    ]
                }

            return {
                "status": "success",
                "message": "Handbook generated successfully",
                "data": slides_data
            }
        else:
            print(f"DashScope Error: {response.code} - {response.message}")
            raise HTTPException(status_code=500, detail=f"AI Generation failed: {response.message}")
            
    except Exception as e:
        print(f"Exception: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/design/poster/generate")
async def generate_poster(theme: str, content: str):
    return {
        "status": "success",
        "message": f"Generating poster for theme: {theme}",
        "image_url": "https://example.com/poster-preview.jpg"
    }

@app.post("/api/growth/video/generate")
async def generate_video(script: str, avatar_id: str):
    return {
        "status": "success",
        "message": "Video generation task started",
        "task_id": "vid-12345",
        "eta_seconds": 120
    }

@app.get("/api/crm/clients")
async def get_crm_clients():
    return [
        {"id": 1, "name": "Tech Corp", "status": "Potential", "last_contact": "2024-02-01"},
        {"id": 2, "name": "Finance Ltd", "status": "Signed", "last_contact": "2024-01-28"},
        {"id": 3, "name": "Retail Inc", "status": "Negotiating", "last_contact": "2024-02-03"},
    ]

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    return {
        "total_projects": 128,
        "active_clients": 45,
        "conversion_rate": "12.5%",
        "revenue": "¥1,250,000"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
