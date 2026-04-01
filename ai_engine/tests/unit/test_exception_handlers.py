"""Tests for api/exception_handlers.py"""

import logging

from api.exception_handlers import InvalidFileTypeError, VectorStoreError


class TestInvalidFileTypeError:
    def test_default_message(self):
        error = InvalidFileTypeError()
        assert error.status_code == 400
        assert "pdf" in error.detail.lower()

    def test_custom_message(self):
        error = InvalidFileTypeError("Custom message")
        assert error.detail == "Custom message"


class TestVectorStoreError:
    def test_default_error(self):
        error = VectorStoreError()
        assert error.status_code == 503
        assert error.detail is not None

    def test_not_found_error(self):
        error = VectorStoreError(log_message="Pinecone index not found")
        assert "not found" in error.detail.lower()

    def test_connection_error(self):
        error = VectorStoreError(log_message="Connection refused")
        assert "connect" in error.detail.lower()

    def test_upsert_error(self):
        error = VectorStoreError(log_message="Upsert failed")
        assert "upsert" in error.detail.lower()

    def test_query_error(self):
        error = VectorStoreError(log_message="Query timeout")
        assert "search" in error.detail.lower() or "failed" in error.detail.lower()

    def test_logs_error_message(self, caplog):
        with caplog.at_level(logging.ERROR):
            _ = VectorStoreError(log_message="Test error message")
        assert any("Test error message" in record.message for record in caplog.records)

    def test_preserves_custom_status_code(self):
        error = VectorStoreError(status_code=400)
        assert error.status_code == 400

    def test_logs_message_is_stored(self):
        error = VectorStoreError(log_message="Log this")
        assert error.log_message == "Log this"

    def test_short_logs_are_truncated(self):
        long_msg = "A" * 200
        error = VectorStoreError(log_message=long_msg)
        assert "Vector store error:" in error.detail
        assert len(error.detail) < 300
