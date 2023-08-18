DROP DATABASE IF EXISTS api;
CREATE DATABASE api WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';
ALTER DATABASE api OWNER TO postgres;

\connect api

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE public.points (
    uid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    coordinates point NOT NULL,
    title "char"[]
);


ALTER TABLE public.points OWNER TO postgres;


INSERT INTO public.points (coordinates, title) VALUES
	('(1,1)', NULL),
	('(2,2)', NULL),
	('(3,3)', NULL);

ALTER TABLE ONLY public.points
    ADD CONSTRAINT points_pkey PRIMARY KEY (uid);

CREATE INDEX "Coordinates" ON public.points USING hash (title);


GRANT ALL ON DATABASE api TO api;



