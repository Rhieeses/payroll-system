--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-02-09 12:02:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 225 (class 1255 OID 57637)
-- Name: total_hours_overtime(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.total_hours_overtime() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure time_in and time_out are not null before calculating
    IF NEW.time_in IS NOT NULL AND NEW.time_out IS NOT NULL THEN
        NEW.total_hours := EXTRACT(EPOCH FROM (NEW.time_out - NEW.time_in)) / 3600.0;
        -- Assuming overtime is any hours above 9 in a day
        IF NEW.total_hours > 9 THEN
            NEW.overtime := NEW.total_hours - 9;
        ELSE
            NEW.overtime := 0;
        END IF;
    ELSE
        NEW.total_hours := NULL;
        NEW.overtime := NULL;
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.total_hours_overtime() OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 65850)
-- Name: update_payroll_on_attendance_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_payroll_on_attendance_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    total_hours NUMERIC(10,2);
    total_overtime NUMERIC(10,2);
    hourly_rate NUMERIC(12,2);
    total_salary NUMERIC(12,2);
BEGIN
    -- Determine payroll period dynamically
    IF EXTRACT(DAY FROM CURRENT_DATE) <= 15 THEN
        start_date := DATE_TRUNC('month', CURRENT_DATE);  -- 1st of the current month
        end_date := start_date + INTERVAL '14 days';      -- 15th of the current month
    ELSE
        start_date := DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '15 days';  -- 16th of the current month
        end_date := DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day';  -- Last day of the month
    END IF;

    -- Calculate total hours, overtime, and salary
    SELECT 
        COALESCE(SUM(a.total_hours), 0),
        COALESCE(SUM(a.overtime), 0),
       (e.salary / 173.33)
    INTO total_hours, total_overtime, hourly_rate
    FROM attendance a
    JOIN employee e ON a.emp_id = e.id
    WHERE a.emp_id = NEW.emp_id AND a.created_at BETWEEN start_date AND end_date
    GROUP BY e.salary;

    -- Compute total salary (regular + overtime at 1.5x)
    total_salary := (total_hours * hourly_rate) + (total_overtime * hourly_rate * 1.5);

	

    -- Insert or update payroll record
    INSERT INTO payroll (emp_id, total_hours, total_overtime, total_salary, payroll_date)
    VALUES (NEW.emp_id, total_hours, total_overtime, total_salary, end_date)
    ON CONFLICT (emp_id, payroll_date) 
    DO UPDATE 
    SET total_hours = EXCLUDED.total_hours,
        total_overtime = EXCLUDED.total_overtime,
        total_salary = EXCLUDED.total_salary;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_payroll_on_attendance_change() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 57631)
-- Name: attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    emp_id integer NOT NULL,
    time_in timestamp(6) without time zone,
    time_out timestamp(6) without time zone,
    total_hours numeric(5,2),
    overtime numeric(5,2),
    status character varying(50) DEFAULT 'absent'::character varying,
    created_at date DEFAULT CURRENT_DATE
);


ALTER TABLE public.attendance OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 57630)
-- Name: attendace_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.attendance ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.attendace_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 57621)
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    id integer NOT NULL,
    name character varying(50),
    description character varying(200),
    created_on date DEFAULT now(),
    department_photo character varying(150),
    deparment_head character varying DEFAULT 'No head yet'::character varying
);


ALTER TABLE public.department OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 57620)
-- Name: department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.department ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.department_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 57569)
-- Name: employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee (
    id integer NOT NULL,
    last_name character varying(20),
    first_name character varying(30),
    middle_name character varying(15),
    email character varying(50),
    contact_no character varying(12),
    employee_photo character varying(100),
    birthday date,
    department character varying(100),
    "position" character varying(100),
    created_at date DEFAULT now(),
    salary numeric(10,2)
);


ALTER TABLE public.employee OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 57568)
-- Name: employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.employee ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.employee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 65839)
-- Name: payroll; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll (
    id integer NOT NULL,
    emp_id integer NOT NULL,
    total_hours numeric(10,2),
    total_overtime numeric(10,2),
    total_salary numeric(12,2),
    payroll_date date DEFAULT CURRENT_DATE,
    status character varying DEFAULT 'unpaid'::character varying NOT NULL
);


ALTER TABLE public.payroll OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 65838)
-- Name: payroll_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.payroll ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.payroll_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 49453)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    username character varying NOT NULL,
    password character varying,
    email character varying,
    date_created date DEFAULT now() NOT NULL,
    "position" character varying DEFAULT USER NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 49452)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4884 (class 0 OID 57631)
-- Dependencies: 222
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, emp_id, time_in, time_out, total_hours, overtime, status, created_at) FROM stdin;
485	2	2025-02-08 08:00:00	2025-02-08 17:00:00	9.00	0.00	present	2025-02-08
486	3	2025-02-08 09:00:00	2025-02-08 17:00:00	8.00	0.00	present	2025-02-08
487	2	2025-02-09 08:30:00	\N	\N	\N	present	2025-02-09
488	3	2025-02-09 08:00:00	\N	\N	\N	present	2025-02-09
\.


--
-- TOC entry 4882 (class 0 OID 57621)
-- Dependencies: 220
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (id, name, description, created_on, department_photo, deparment_head) FROM stdin;
1	human resource	responsible for the effective hiring, training, developing, compensating, and management of these employees	2024-11-22	/uploads/employee-photo1732206435829.jpg	No head yet
2	I.T	charged with establishing, monitoring and maintaining information technology systems and services	2024-11-28	/uploads/employee-photo1732781451866.jpg	No head yet
\.


--
-- TOC entry 4880 (class 0 OID 57569)
-- Dependencies: 218
-- Data for Name: employee; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee (id, last_name, first_name, middle_name, email, contact_no, employee_photo, birthday, department, "position", created_at, salary) FROM stdin;
3	prado	mitch		mitch.prado@gmail.com	09231204701	/uploads/employee-photo1732781571708.jpg	2002-04-10	I.T	software developer	2024-11-28	33000.00
2	abenojar	kier		kier.kieree@gmail.com	09210204701	/uploads/employee-photo1732463207522.svg	2002-12-21	human resource	H.R assistant	2024-11-24	45500.00
\.


--
-- TOC entry 4886 (class 0 OID 65839)
-- Dependencies: 224
-- Data for Name: payroll; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll (id, emp_id, total_hours, total_overtime, total_salary, payroll_date, status) FROM stdin;
1	2	9.00	0.00	2362.59	2025-02-15	unpaid
2	3	8.00	0.00	1523.12	2025-02-15	unpaid
\.


--
-- TOC entry 4878 (class 0 OID 49453)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, username, password, email, date_created, "position") FROM stdin;
1	kier	admin	$2b$10$.EXPhQPJpzhpceNEnjSqGON5xuNNlFrAQf/NjH3nhKfM13yaeETpy	kier.kieree@gmail.com	2024-11-10	User
\.


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 221
-- Name: attendace_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendace_id_seq', 488, true);


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 219
-- Name: department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_id_seq', 2, true);


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 217
-- Name: employee_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_id_seq', 3, true);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 223
-- Name: payroll_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payroll_id_seq', 4, true);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 4726 (class 2606 OID 57635)
-- Name: attendance attendace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendace_pkey PRIMARY KEY (id);


--
-- TOC entry 4724 (class 2606 OID 57626)
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (id);


--
-- TOC entry 4722 (class 2606 OID 57576)
-- Name: employee employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (id);


--
-- TOC entry 4728 (class 2606 OID 65844)
-- Name: payroll payroll_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_pkey PRIMARY KEY (id);


--
-- TOC entry 4730 (class 2606 OID 65853)
-- Name: payroll unique_payroll_entry; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT unique_payroll_entry UNIQUE (emp_id, payroll_date);


--
-- TOC entry 4720 (class 2606 OID 49461)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4732 (class 2620 OID 57638)
-- Name: attendance trigger_total_hours_overtime; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_total_hours_overtime BEFORE INSERT OR UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.total_hours_overtime();


--
-- TOC entry 4733 (class 2620 OID 65851)
-- Name: attendance trigger_update_payroll; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_payroll AFTER INSERT OR DELETE OR UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.update_payroll_on_attendance_change();


--
-- TOC entry 4731 (class 2606 OID 65845)
-- Name: payroll payroll_emp_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll
    ADD CONSTRAINT payroll_emp_id_fkey FOREIGN KEY (emp_id) REFERENCES public.employee(id);


-- Completed on 2025-02-09 12:02:43

--
-- PostgreSQL database dump complete
--

