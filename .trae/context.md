# Global Context & Alignment Rules

> **CRITICAL RULE**: All API calls, Database Schemas, and Frontend Interfaces MUST strictly align with the definitions in `frontend/src/shared/api-schema.ts`.

## 1. Single Source of Truth
- **Definition File**: `frontend/src/shared/api-schema.ts`
- **Enforcement**:
  - When modifying **Backend Models** (`backend/models.py`), you MUST check `api-schema.ts` to ensure field names and types match.
  - When writing **Frontend API Calls**, you MUST import types from `api-schema.ts`.
  - When creating **Database Tables** (Supabase), column names must match the schema properties (snake_case in DB/Python vs camelCase/snake_case in TS as defined).

## 2. Cross-Stack Alignment
| Concept | Frontend (TS) | Backend (Python/Pydantic) | Database (SQL) |
|Str|Str|Str|Str|
| **User ID** | `id: string` (UUID) | `id: UUID` | `id UUID` |
| **Email** | `email: string` | `email: str` | `email TEXT` |
| **Role** | `'admin' \| 'member'` | `role: str` | `role VARCHAR` |

## 3. Workflow for API Changes
1. **Define**: Update `frontend/src/shared/api-schema.ts` first.
2. **Implement Backend**: Update `models.py` and Pydantic schemas to match.
3. **Implement Frontend**: Use the updated types in components/services.
4. **Verify**: Ensure the JSON response from backend strictly validates against the TS interface.

## 4. Trae Context Awareness
- Before writing any code involving data exchange, **READ** `frontend/src/shared/api-schema.ts`.
- If you find a discrepancy, **STOP** and ask the user or fix the schema first.
