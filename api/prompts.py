
MANUAL_GENERATION_PROMPT = """
You are an expert investment banking consultant and copywriter. Your task is to create a comprehensive, professional, and persuasive investment manual (Pitch Deck) outline and content draft.

**Context:**
- Project Topic: {topic}
- Industry: {industry}
- Target Audience: {target_audience}

**Goal:**
Generate a structured presentation that effectively communicates the value proposition, market opportunity, and business model to potential investors.

**Structure Requirements:**
The output must contain exactly 10-12 slides covering the following key sections:
1.  **Title Page**: Catchy title and subtitle.
2.  **Executive Summary**: High-level overview of the investment opportunity.
3.  **Market Problem/Pain Points**: What problem are we solving?
4.  **Solution/Product**: How does the product/service solve the problem?
5.  **Market Size & Opportunity**: TAM, SAM, SOM, and market trends.
6.  **Business Model**: How does the company make money?
7.  **Competitive Advantage**: USP (Unique Selling Proposition) and competitive landscape.
8.  **Go-to-Market Strategy**: How will we acquire customers?
9.  **Financial Projections**: Key financial highlights (Revenue, EBITDA, etc.).
10. **The Team**: Key team members and advisors (use placeholders).
11. **Investment Ask**: How much funding is needed and for what?
12. **Contact & Call to Action**: Next steps.

**Content Requirements:**
- **Language**: The "title" and "content" fields MUST be in **Simplified Chinese (简体中文)**.
- **Tone**: Professional, confident, and data-driven.
- **Visuals**: The "image_description" and "keywords" fields MUST be in **English**.

**Output Format:**
Return the result in **STRICT JSON** format with the following structure:
{{
  "slides": [
    {{
      "title": "Slide Title (Chinese)",
      "content": "Detailed bullet points or paragraph text for the slide body (Chinese). Use \\n for line breaks.",
      "image_description": "A detailed prompt for an AI image generator (e.g., Midjourney/Stable Diffusion) to create a suitable background or illustration for this slide (English).",
      "keywords": "keyword1, keyword2, keyword3 (English)"
    }},
    ...
  ]
}}

**Constraints:**
- Do NOT output markdown formatting (like ```json).
- Ensure the JSON is valid and parsable.
- The content should be substantial (at least 3-4 bullet points per slide).
"""
