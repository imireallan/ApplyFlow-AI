import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

class VectorService:
    def __init__(self):
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "applyflow-cvs")
        self.pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

        # running the model locally
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # Ensure index exists
        if self.index_name not in [idx.name for idx in self.pc.list_indexes()]:
            self.pc.create_index(
                name=self.index_name,
                dimension=384,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )

    def upsert_cv(self, file_path: str):
        # 1. Load PDF
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        # 2. Split into chunks (Best practice for RAG)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        docs = text_splitter.split_documents(documents)

        # 3. Upload to Pinecone
        PineconeVectorStore.from_documents(
            docs, 
            self.embeddings, 
            index_name=self.index_name
        )
        return {"status": "success", "chunks": len(docs)}

    def query_cv(self, job_description: str, k: int = 3):
        """
        Search for the most relevant resume chunks based on a job description.
        k: number of matches to return
        """
        # Load existing index
        vectorstore = PineconeVectorStore(
            index_name=self.index_name, 
            embedding=self.embeddings
        )

        # Perform the search
        # This automatically uses the HuggingFace model to embed the job_description
        results = vectorstore.similarity_search_with_score(job_description, k=k)

        # Format results for the API response
        formatted_results = []
        for doc, score in results:
            formatted_results.append({
                "score": round(float(score), 4),
                "content": doc.page_content,
                "metadata": doc.metadata
            })

        return formatted_results