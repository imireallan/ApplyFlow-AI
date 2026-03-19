from core.application.ports.vector_store_port import VectorStorePort
from core.application.ports.llm_port import LLMPort

class AppContainer:
    vector_store: VectorStorePort | None = None
    llm: LLMPort | None = None


container = AppContainer()