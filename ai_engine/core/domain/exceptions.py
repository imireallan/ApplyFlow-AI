class UserNotFoundError(Exception):
    pass


class UserCreationError(Exception):
    pass


class DomainError(Exception):
    pass


class LLMError(DomainError):
    pass


class VectorStoreError(DomainError):
    pass
