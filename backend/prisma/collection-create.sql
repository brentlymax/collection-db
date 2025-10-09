DROP TABLE IF EXISTS `comics_graded`;
CREATE TABLE `comics_graded` (
	title			varchar(250) not null,
	issue			varchar(10) not null,
	pub_month		smallint,
	pub_year		smallint,
	publisher		varchar(50) not null,
	grade			decimal(4, 2),
	page_qual		varchar(50) not null,
	grader			varchar(20) not null,
	cert_num		varchar(20) not null primary key,
	label_type		varchar(50) not null,
	variant			varchar(250),
	key_notes		varchar(250),
	signed_by		varchar(250),
	pedigree		varchar(250)
);

-- DROP TABLE IF EXISTS `comics_ungraded`;
-- CREATE TABLE `comics_ungraded` (
-- 	title			varchar(250) not null,
-- 	issue			varchar(5) not null,
-- 	est_grade		decimal(2, 2),
-- 	est_page		varchar(50),
-- 	publisher		varchar(50) not null,
-- 	month			smallint,
-- 	year			smallint,
-- 	variant			varchar(250),
-- 	key_notes		varchar(250),
-- 	signed_by		varchar(250),
-- 	pedigree		varchar(250)
-- );

-- DROP TABLE IF EXISTS `pokemon_cards_graded`;
-- CREATE TABLE `pokemon_cards_graded` (
	
-- );

-- DROP TABLE IF EXISTS `magic_cards_graded`;
-- CREATE TABLE `magic_cards_graded` (
	
-- );

-- DROP TABLE IF EXISTS `art_original`;
-- CREATE TABLE `art_original` (
	
-- );

-- DROP TABLE IF EXISTS `art_prints`;
-- CREATE TABLE `art_prints` (
	
-- );
