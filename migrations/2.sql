
CREATE TABLE happy_hour_coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER,
  coupon_code TEXT NOT NULL UNIQUE,
  event_id INTEGER,
  is_redeemed BOOLEAN DEFAULT 0,
  redeemed_at DATETIME,
  valid_from DATETIME NOT NULL,
  valid_until DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_happy_hour_coupons_member_id ON happy_hour_coupons(member_id);
CREATE INDEX idx_happy_hour_coupons_code ON happy_hour_coupons(coupon_code);
