from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from crewai import Agent, Task, Crew, Process, LLM
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="NLP-to-App Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Cerebras LLM
cerebras_llm = LLM(
    model="cerebras/llama3.1-70b",
    api_key=os.environ.get("CEREBRAS_API_KEY"),
    base_url="https://api.cerebras.ai/v1",
    temperature=0.7,
)

@app.get("/")
async def root():
    return {"message": "NLP-to-App Platform API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/v1/generate")
async def generate_code(request: dict):
    description = request.get("description", "")
    
    # Define code generation agent
    code_agent = Agent(
        role='Senior Full-Stack Developer',
        goal=f'Generate production-ready code based on: {description}',
        backstory='Expert developer with 10+ years building web applications',
        llm=cerebras_llm
    )
    
    # Define code generation task
    code_task = Task(
        description=f'Create a complete web application for: {description}. Include HTML, CSS, and JavaScript.',
        expected_output='Complete, working code with all necessary files',
        agent=code_agent
    )
    
    # Execute
    crew = Crew(
        agents=[code_agent],
        tasks=[code_task],
        process=Process.sequential,
        verbose=True
    )
    
    result = crew.kickoff()
    
    return {
        "status": "success",
        "code": str(result),
        "description": description
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
