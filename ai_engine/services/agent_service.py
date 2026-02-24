import os
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from services.vector_service import VectorService
from models.prompts import NUDGE_SYSTEM_PROMPT, NUDGE_USER_PROMPT

class AgentService:
    def __init__(self):
        self.vector_service = VectorService()
        self.provider = os.getenv("LLM_PROVIDER", "groq").lower()
        
        if self.provider == "openai":
            self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
        else:
            # Llama 3 on Groq for testing
            self.llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.7)

    def process_job_application(self, job_description: str, top_k:  int):
        matches = self.vector_service.query_cv(job_description, k=top_k)

        prompt = ChatPromptTemplate.from_messages([
            ("system", NUDGE_SYSTEM_PROMPT),
            ("user", NUDGE_USER_PROMPT)
        ])

        chain = prompt | self.llm | JsonOutputParser()
        
        enriched_results = []
        for match in matches:
            ai_analysis = chain.invoke({
                "context": match["content"], 
                "job_desc": job_description
            })
            
            enriched_results.append({
                "id": match.get("id"),
                "content": match["content"],
                "score": ai_analysis.get("match_score"),
                "reasoning": ai_analysis.get("reasoning"),
                "nudge": ai_analysis.get("nudge")
            })
                    
        return enriched_results