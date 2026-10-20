from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(text: str) -> list[str]:

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
        # splitting priority
        #   paragraph "\n\n"
        #   lines "\n"
        #   sentences "."
        #   words " "
        #   characters ""
        separators=["\n\n", "\n", ".", " ", ""],
    )

    result: list[str] = splitter.split_text(text)
    return result
