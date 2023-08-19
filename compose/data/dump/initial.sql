DROP DATABASE IF EXISTS api;
CREATE DATABASE api WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';
ALTER DATABASE api OWNER TO postgres;

\connect api

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';
SET default_table_access_method = heap;

DROP TABLE IF EXISTS public.points;
CREATE TABLE public.points (
    uid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    coordinates point NOT NULL,
    json "json"
);


ALTER TABLE public.points OWNER TO postgres;

ALTER TABLE ONLY public.points
    ADD CONSTRAINT points_pkey PRIMARY KEY (uid);

