"""Tests for core/utils/text_chunker.py"""
from core.utils.text_chunker import chunk_text


class TestChunkText:
    """Test text splitting functionality."""

    def test_chunk_text_splits_long_text(self):
        long_text = "Sentence one. " * 100
        chunks = chunk_text(long_text)
        assert len(chunks) > 1
        assert all(isinstance(chunk, str) for chunk in chunks)

    def test_chunk_text_returns_list(self):
        result = chunk_text("Some text here.")
        assert isinstance(result, list)

    def test_chunk_text_empty_string(self):
        result = chunk_text("")
        assert isinstance(result, list)

    def test_chunk_text_single_word(self):
        result = chunk_text("Hello")
        assert isinstance(result, list)
        assert len(result) >= 1

    def test_chunk_text_preserves_content(self):
        original = "This is a test of the emergency broadcast system. " * 50
        chunks = chunk_text(original)
        joined = " ".join(chunks)
        # All words should be present
        for word in original.split():
            assert word in joined

    def test_chunk_text_respects_chunk_size(self):
        long_text = "Word " * 500
        chunks = chunk_text(long_text)
        # Most chunks should be around 800 chars +- overlap
        for chunk in chunks:
            assert len(chunk) <= 1000  # chunk_size + some overlap

    def test_chunk_text_with_newlines(self):
        text = "\n\nSection 1\n\nParagraph one.\n\nSection 2\n\nParagraph two."
        chunks = chunk_text(text)
        assert len(chunks) >= 1

    def test_chunk_text_with_special_chars(self):
        text = "Python!@#$%^&*()\nFastAPI + React = Great API"
        chunks = chunk_text(text)
        assert len(chunks) >= 1
