"""fix foreign key cv.id column -(second fix)

Revision ID: 19787d58b7e2
Revises: b2d7ee86d52c
Create Date: 2026-03-05 13:02:16.661453

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "19787d58b7e2"
down_revision: Union[str, Sequence[str], None] = "b2d7ee86d52c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Drop foreign key constraints first
    op.drop_constraint("cv_embeddings_cv_id_fkey", "cv_embeddings", type_="foreignkey")
    op.drop_constraint("cv_profiles_cv_id_fkey", "cv_profiles", type_="foreignkey")


    # Alter column types
    op.alter_column(
        "cv_embeddings",
        "cv_id",
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        postgresql_using="cv_id::uuid",
        existing_nullable=False,
    )
    op.alter_column(
        "cv_profiles",
        "cv_id",
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        postgresql_using="cv_id::uuid",
        existing_nullable=False,
    )
    op.alter_column(
        "cvs",
        "id",
        existing_type=sa.VARCHAR(),
        type_=sa.UUID(),
        postgresql_using="id::uuid",
        existing_nullable=False,
    )

    # Recreate foreign key constraints
    op.create_foreign_key(
        "cv_embeddings_cv_id_fkey",
        "cv_embeddings",
        "cvs",
        ["cv_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "cv_profiles_cv_id_fkey",
        "cv_profiles",
        "cvs",
        ["cv_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Drop foreign key constraints first
    op.drop_constraint("cv_embeddings_cv_id_fkey", "cv_embeddings", type_="foreignkey")
    op.drop_constraint("cv_profiles_cv_id_fkey", "cv_profiles", type_="foreignkey")

    # Alter column types back
    op.alter_column(
        "cvs",
        "id",
        existing_type=sa.UUID(),
        type_=sa.VARCHAR(),
        existing_nullable=False,
    )
    op.alter_column(
        "cv_profiles",
        "cv_id",
        existing_type=sa.UUID(),
        type_=sa.VARCHAR(),
        existing_nullable=False,
    )
    op.alter_column(
        "cv_embeddings",
        "cv_id",
        existing_type=sa.UUID(),
        type_=sa.VARCHAR(),
        existing_nullable=False,
    )

    # Recreate foreign key constraints
    op.create_foreign_key(
        "cv_embeddings_cv_id_fkey",
        "cv_embeddings",
        "cvs",
        ["cv_id"],
        ["id"],
        ondelete="CASCADE",
    )
    op.create_foreign_key(
        "cv_profiles_cv_id_fkey",
        "cv_profiles",
        "cvs",
        ["cv_id"],
        ["id"],
        ondelete="CASCADE",
    )
