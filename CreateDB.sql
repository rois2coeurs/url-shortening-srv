CREATE TABLE URL
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    url         VARCHAR(255) NOT NULL,
    shortCode    VARCHAR(255) NOT NULL UNIQUE,
    createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accessCount INT       DEFAULT 0
);

CREATE TRIGGER [updatedAt]
    AFTER UPDATE
                             ON URL
                             FOR EACH ROW
BEGIN
UPDATE URL SET updatedAt = CURRENT_TIMESTAMP WHERE id = old.id;
END;