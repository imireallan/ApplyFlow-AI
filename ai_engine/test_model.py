from langchain_huggingface import HuggingFaceEmbeddings
from transformers import AutoTokenizer

model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

text = "I am an expert in Docker and AWS EKS"

tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
tokens = tokenizer.tokenize(text)
token_ids = tokenizer.convert_tokens_to_ids(tokens)


vector = model.embed_query(text)

print(f"\n--- Model in Action ---")
print(f"Tokens: {tokens}")
print(f"Token IDs: {token_ids}")
print(f"Text: {text}")
print(f"Vector Dimensions: {len(vector)}") # Should be 384
print(f"First 5 numbers: {vector[:5]}")
print(f"-----------------------\n")