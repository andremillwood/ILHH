
DROP INDEX idx_member_saved_galleries_member_id;
DROP INDEX idx_member_saved_mixtapes_member_id;
DROP TABLE member_saved_galleries;
DROP TABLE member_saved_mixtapes;
ALTER TABLE members DROP COLUMN location;
ALTER TABLE members DROP COLUMN bio;
ALTER TABLE members DROP COLUMN favorite_genre;
