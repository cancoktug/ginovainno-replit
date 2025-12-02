--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (63f4182)
-- Dumped by pg_dump version 16.9

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

ALTER TABLE IF EXISTS ONLY public.team_members DROP CONSTRAINT IF EXISTS team_members_updated_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.team_members DROP CONSTRAINT IF EXISTS team_members_created_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.startups DROP CONSTRAINT IF EXISTS startups_updated_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.startups DROP CONSTRAINT IF EXISTS startups_created_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_updated_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_created_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.mentors DROP CONSTRAINT IF EXISTS mentors_updated_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.mentors DROP CONSTRAINT IF EXISTS mentors_created_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.mentor_bookings DROP CONSTRAINT IF EXISTS mentor_bookings_mentor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.mentor_availability DROP CONSTRAINT IF EXISTS mentor_availability_mentor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_updated_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_created_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.event_applications DROP CONSTRAINT IF EXISTS event_applications_reviewed_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.event_applications DROP CONSTRAINT IF EXISTS event_applications_event_id_events_id_fk;
ALTER TABLE IF EXISTS ONLY public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_updated_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_created_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_reviewed_by_users_id_fk;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_program_id_programs_id_fk;
DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.team_members DROP CONSTRAINT IF EXISTS team_members_pkey;
ALTER TABLE IF EXISTS ONLY public.startups DROP CONSTRAINT IF EXISTS startups_pkey;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS projects_slug_key;
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS projects_pkey;
ALTER TABLE IF EXISTS ONLY public.programs DROP CONSTRAINT IF EXISTS programs_pkey;
ALTER TABLE IF EXISTS ONLY public.mentors DROP CONSTRAINT IF EXISTS mentors_pkey;
ALTER TABLE IF EXISTS ONLY public.mentor_bookings DROP CONSTRAINT IF EXISTS mentor_bookings_pkey;
ALTER TABLE IF EXISTS ONLY public.mentor_availability DROP CONSTRAINT IF EXISTS mentor_availability_pkey;
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_slug_key;
ALTER TABLE IF EXISTS ONLY public.events DROP CONSTRAINT IF EXISTS events_pkey;
ALTER TABLE IF EXISTS ONLY public.event_applications DROP CONSTRAINT IF EXISTS event_applications_pkey;
ALTER TABLE IF EXISTS ONLY public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_pkey;
ALTER TABLE IF EXISTS ONLY public.applications DROP CONSTRAINT IF EXISTS applications_pkey;
ALTER TABLE IF EXISTS public.team_members ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.startups ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.projects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.programs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mentors ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mentor_bookings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mentor_availability ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.events ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.event_applications ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blog_posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.applications ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.team_members_id_seq;
DROP TABLE IF EXISTS public.team_members;
DROP SEQUENCE IF EXISTS public.startups_id_seq;
DROP TABLE IF EXISTS public.startups;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.projects_id_seq;
DROP TABLE IF EXISTS public.projects;
DROP SEQUENCE IF EXISTS public.programs_id_seq;
DROP TABLE IF EXISTS public.programs;
DROP SEQUENCE IF EXISTS public.mentors_id_seq;
DROP TABLE IF EXISTS public.mentors;
DROP SEQUENCE IF EXISTS public.mentor_bookings_id_seq;
DROP TABLE IF EXISTS public.mentor_bookings;
DROP SEQUENCE IF EXISTS public.mentor_availability_id_seq;
DROP TABLE IF EXISTS public.mentor_availability;
DROP SEQUENCE IF EXISTS public.events_id_seq;
DROP TABLE IF EXISTS public.events;
DROP SEQUENCE IF EXISTS public.event_applications_id_seq;
DROP TABLE IF EXISTS public.event_applications;
DROP SEQUENCE IF EXISTS public.blog_posts_id_seq;
DROP TABLE IF EXISTS public.blog_posts;
DROP SEQUENCE IF EXISTS public.applications_id_seq;
DROP TABLE IF EXISTS public.applications;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    program_id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    birth_date text NOT NULL,
    education text NOT NULL,
    experience text NOT NULL,
    motivation text NOT NULL,
    expectations text NOT NULL,
    previous_experience text,
    linkedin_profile text,
    cv text,
    status text DEFAULT 'pending'::text NOT NULL,
    review_notes text,
    reviewed_by character varying,
    reviewed_at timestamp without time zone,
    submitted_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.applications OWNER TO neondb_owner;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO neondb_owner;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    image text NOT NULL,
    author text NOT NULL,
    published_at timestamp without time zone,
    is_published boolean DEFAULT false NOT NULL,
    created_by character varying,
    updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    slug character varying(255),
    gallery text
);


ALTER TABLE public.blog_posts OWNER TO neondb_owner;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_posts_id_seq OWNER TO neondb_owner;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: event_applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.event_applications (
    id integer NOT NULL,
    event_id integer NOT NULL,
    event_title text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    organization text,
    "position" text,
    experience text,
    motivation text NOT NULL,
    dietary_requirements text,
    additional_notes text,
    status text DEFAULT 'Beklemede'::text NOT NULL,
    review_notes text,
    reviewed_by character varying,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.event_applications OWNER TO neondb_owner;

--
-- Name: event_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.event_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_applications_id_seq OWNER TO neondb_owner;

--
-- Name: event_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.event_applications_id_seq OWNED BY public.event_applications.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date timestamp without time zone NOT NULL,
    "time" text NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    is_online boolean DEFAULT false NOT NULL,
    registration_url text,
    is_active boolean DEFAULT true NOT NULL,
    created_by character varying,
    updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    slug text,
    gallery text,
    status text DEFAULT 'upcoming'::text NOT NULL
);


ALTER TABLE public.events OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO neondb_owner;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: mentor_availability; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mentor_availability (
    id integer NOT NULL,
    mentor_id integer NOT NULL,
    day_of_week integer NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.mentor_availability OWNER TO neondb_owner;

--
-- Name: mentor_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mentor_availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentor_availability_id_seq OWNER TO neondb_owner;

--
-- Name: mentor_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mentor_availability_id_seq OWNED BY public.mentor_availability.id;


--
-- Name: mentor_bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mentor_bookings (
    id integer NOT NULL,
    mentor_id integer NOT NULL,
    applicant_name text NOT NULL,
    applicant_email text NOT NULL,
    applicant_phone text,
    company text,
    meeting_date date NOT NULL,
    meeting_time text NOT NULL,
    duration integer DEFAULT 60 NOT NULL,
    topic text NOT NULL,
    message text,
    status text DEFAULT 'pending'::text NOT NULL,
    meeting_link text,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.mentor_bookings OWNER TO neondb_owner;

--
-- Name: mentor_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mentor_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentor_bookings_id_seq OWNER TO neondb_owner;

--
-- Name: mentor_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mentor_bookings_id_seq OWNED BY public.mentor_bookings.id;


--
-- Name: mentors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.mentors (
    id integer NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    expertise text NOT NULL,
    image text NOT NULL,
    linkedin text,
    email text,
    bio text,
    is_active boolean DEFAULT true NOT NULL,
    created_by character varying,
    updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_available_for_booking boolean DEFAULT false NOT NULL
);


ALTER TABLE public.mentors OWNER TO neondb_owner;

--
-- Name: mentors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.mentors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentors_id_seq OWNER TO neondb_owner;

--
-- Name: mentors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.mentors_id_seq OWNED BY public.mentors.id;


--
-- Name: programs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.programs (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    duration text NOT NULL,
    icon text NOT NULL,
    image text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by character varying,
    updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    title text NOT NULL,
    short_description text NOT NULL,
    level text NOT NULL,
    category text NOT NULL,
    price text,
    capacity integer,
    application_deadline timestamp without time zone,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    location text,
    requirements text,
    syllabus text,
    instructors text,
    is_published boolean DEFAULT false NOT NULL
);


ALTER TABLE public.programs OWNER TO neondb_owner;

--
-- Name: programs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programs_id_seq OWNER TO neondb_owner;

--
-- Name: programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.programs_id_seq OWNED BY public.programs.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    slug character varying NOT NULL,
    status character varying DEFAULT 'ongoing'::character varying NOT NULL,
    supporter character varying,
    budget_amount numeric,
    budget_currency character varying DEFAULT 'TRY'::character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_by character varying,
    updated_by character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    type character varying(100) DEFAULT 'Araştırma'::character varying NOT NULL,
    task text,
    duration character varying(100)
);


ALTER TABLE public.projects OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: startups; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.startups (
    id integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    funding text,
    status text NOT NULL,
    icon text NOT NULL,
    website text,
    is_active boolean DEFAULT true NOT NULL,
    created_by character varying,
    updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.startups OWNER TO neondb_owner;

--
-- Name: startups_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.startups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.startups_id_seq OWNER TO neondb_owner;

--
-- Name: startups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.startups_id_seq OWNED BY public.startups.id;


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    image text NOT NULL,
    bio text,
    linkedin text,
    email text,
    is_board boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by character varying,
    updated_by character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    category character varying(50) DEFAULT 'ekip'::character varying
);


ALTER TABLE public.team_members OWNER TO neondb_owner;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_id_seq OWNER TO neondb_owner;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id character varying NOT NULL,
    email character varying NOT NULL,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'editor'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    last_login_at timestamp without time zone,
    password character varying(255)
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: event_applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.event_applications ALTER COLUMN id SET DEFAULT nextval('public.event_applications_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: mentor_availability id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentor_availability ALTER COLUMN id SET DEFAULT nextval('public.mentor_availability_id_seq'::regclass);


--
-- Name: mentor_bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentor_bookings ALTER COLUMN id SET DEFAULT nextval('public.mentor_bookings_id_seq'::regclass);


--
-- Name: mentors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentors ALTER COLUMN id SET DEFAULT nextval('public.mentors_id_seq'::regclass);


--
-- Name: programs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.programs ALTER COLUMN id SET DEFAULT nextval('public.programs_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: startups id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.startups ALTER COLUMN id SET DEFAULT nextval('public.startups_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.applications (id, program_id, first_name, last_name, email, phone, birth_date, education, experience, motivation, expectations, previous_experience, linkedin_profile, cv, status, review_notes, reviewed_by, reviewed_at, submitted_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.blog_posts (id, title, excerpt, content, category, image, author, published_at, is_published, created_by, updated_by, created_at, updated_at, slug, gallery) FROM stdin;
3	Teknoparklarda Girişimcilik: İnovasyon Merkezlerinin Gücü	Türkiye'deki teknoparklar, startup'lar için benzersiz fırsatlar sunuyor. Araştırma-geliştirme destekleri ve iş ağları hakkında bilmeniz gerekenler.	<h2>Teknoparklar: Modern Girişimciliğin Kalbi</h2>\n\n<p>Teknoparklar, akademik araştırma ile ticari uygulamayı buluşturan köprüler olarak, girişimcilik ekosisteminin en önemli parçalarından biri haline geldi. Türkiye'de 80'den fazla teknopark faaliyet gösteriyor ve binlerce startup'a ev sahipliği yapıyor.</p>\n\n<h3>Teknoparkların Girişimcilere Sunduğu Avantajlar</h3>\n\n<ul>\n<li><strong>AR-GE Destekleri:</strong> TÜBİTAK ve Bakanlık destekleriyle projelerinizi hayata geçirin</li>\n<li><strong>Vergi Avantajları:</strong> Gelir vergisi muafiyeti ve diğer teşvikler</li>\n<li><strong>Mentorship İmkanları:</strong> Deneyimli girişimciler ve akademisyenlerden destek</li>\n<li><strong>Ortak Çalışma Alanları:</strong> Modern ofisler ve laboratuvar imkanları</li>\n<li><strong>Networking:</strong> Benzer hedeflere sahip girişimcilerle tanışma fırsatı</li>\n</ul>\n\n<h3>Başarılı Teknopark Örnekleri</h3>\n\n<p><strong>İTÜ Çekirdek:</strong> Türkiye'nin en köklü girişimcilik merkezlerinden biri olan İTÜ Çekirdek, 500'den fazla startup'a destek verdi.</p>\n\n<p><strong>ODTÜ Teknokent:</strong> Özellikle savunma ve havacılık sektörlerinde güçlü, 300'den fazla şirketle Türkiye'nin en büyük teknoparkı.</p>\n\n<p><strong>İstanbul Teknik Üniversitesi ARI Teknokent:</strong> Bilişim, malzeme ve enerji teknolojilerinde uzmanlaşmış.</p>\n\n<h3>Teknopark Başvuru Süreci</h3>\n\n<p>Teknopark'a başvuru sürecinde dikkat edilmesi gerekenler:</p>\n\n<ol>\n<li><strong>Proje Planı:</strong> Detaylı iş planı ve teknik dokümentasyon hazırlayın</li>\n<li><strong>Takım Yapısı:</strong> Projenizi gerçekleştirecek ekibinizi belirleyin</li>\n<li><strong>Finansman Planı:</strong> İlk aşama için gerekli kaynakları hesaplayın</li>\n<li><strong>Pazar Analizi:</strong> Hedef pazarınızı ve rekabet durumunu analiz edin</li>\n</ol>\n\n<h3>Başarı Hikayeleri</h3>\n\n<p>Teknoparkların bünyesinden çıkan başarılı şirketler, girişimcilere ilham veriyor:</p>\n\n<ul>\n<li><strong>Aselsan:</strong> ODTÜ Teknokent'ten çıkarak savunma sanayisinde global oyuncu oldu</li>\n<li><strong>Logo Yazılım:</strong> Ankara'da başlayıp dünya çapında tanınan yazılım şirketi</li>\n<li><strong>Vestel:</strong> AR-GE merkezleriyle sürekli yenilik üreten teknoloji devi</li>\n</ul>\n\n<h3>Gelecek Perspektifi</h3>\n\n<p>Teknoparklar, dijital dönüşüm ve Endüstri 4.0 ile birlikte daha da önemli hale geliyor. Yapay zeka, nesnelerin interneti ve robot teknolojileri gibi alanlarda yeni fırsatlar doğuyor.</p>\n\n<p>Girişimci adaylarına tavsiye: Teknoparkları sadece fiziksel mekan olarak değil, ekosistem ve topluluk olarak değerlendirin. Buradaki ağlar ve deneyimler, başarınızın anahtarı olabilir.</p>	blog	/api/media/blog/technopark-innovation.svg	Prof. Dr. Elif Kocabaş	2025-01-10 14:30:00	t	41781800	41781800	2025-07-08 09:37:19.44807	2025-07-08 09:37:19.44807	teknoparklarda-girisimcilik-inovasyon-merkezleri	\N
4	Yapay Zeka Çağında Girişimcilik: Fırsatlar ve Zorluklar	AI teknolojileri girişimcilik dünyasını köklü şekilde değiştiriyor. Bu dönüşümde öne çıkmanın yollarını ve dikkat edilmesi gereken noktaları keşfedin.	<h2>Yapay Zeka: Girişimciliğin Yeni Paradigması</h2>\n\n<p>Yapay zeka teknolojileri, girişimcilik dünyasında devrim niteliğinde değişimler yaratıyor. Bu teknolojiler sadece büyük şirketlerin tekelinde değil; küçük startuplar da AI'ın gücünden yararlanarak rekabet avantajı elde edebiliyor.</p>\n\n<h3>AI Destekli Girişimcilik Alanları</h3>\n\n<ul>\n<li><strong>Otomatizasyon Çözümleri:</strong> İş süreçlerini optimize eden AI uygulamaları</li>\n<li><strong>Kişiselleştirilmiş Hizmetler:</strong> Müşteri deneyimini geliştiren akıllı sistemler</li>\n<li><strong>Predictive Analytics:</strong> Veri analizi ile gelecek öngörüleri</li>\n<li><strong>Doğal Dil İşleme:</strong> Chatbot'lar ve sesli asistanlar</li>\n<li><strong>Görüntü İşleme:</strong> Medikal görüntüleme ve güvenlik sistemleri</li>\n</ul>\n\n<h3>Başarılı AI Startup Stratejileri</h3>\n\n<p><strong>1. Spesifik Problem Odaklı Yaklaşım</strong><br>\nGenel AI çözümler yerine, belirli sektörlerin spesifik problemlerine odaklanın.</p>\n\n<p><strong>2. Minimal Viable Product (MVP) Geliştirme</strong><br>\nKarmaşık AI modelleri geliştirmeden önce, basit çözümlerle başlayın ve iteratif olarak geliştirin.</p>\n\n<p><strong>3. Veri Stratejisi</strong><br>\nAI'ın gücü verilerden gelir. Kaliteli veri toplama ve işleme süreçlerinizi önceliklendirin.</p>\n\n<p><strong>4. İnsan-AI İşbirliği</strong><br>\nTamamen otonom sistemler yerine, insan zekasını AI ile birleştiren çözümler geliştirin.</p>\n\n<h3>Dikkat Edilmesi Gereken Zorluklar</h3>\n\n<ul>\n<li><strong>Yetenek Açığı:</strong> AI uzmanları bulma ve işte tutma zorluğu</li>\n<li><strong>Veri Gizliliği:</strong> GDPR ve yerel veri koruma yasalarına uyum</li>\n<li><strong>Algoritmik Önyargı:</strong> Adil ve objektif AI sistemleri geliştirme</li>\n<li><strong>Yüksek Başlangıç Maliyetleri:</strong> Donanım ve yazılım yatırımları</li>\n<li><strong>Düzenleyici Belirsizlikler:</strong> AI'ya yönelik hukuki düzenlemelerin gelişmesi</li>\n</ul>\n\n<h3>Türkiye'deki AI Girişimcilik Ortamı</h3>\n\n<p>Türkiye'de AI alanında faaliyet gösteren startuplar hızla artıyor:</p>\n\n<ul>\n<li><strong>Devlet Destekleri:</strong> TÜBİTAK ARDEB ve TEYDEB programları</li>\n<li><strong>Akademik İşbirlikleri:</strong> Üniversitelerle ortak AR-GE projeleri</li>\n<li><strong>Uluslararası Bağlantılar:</strong> Global teknoloji devleriyle partnership fırsatları</li>\n<li><strong>Yatırımcı İlgisi:</strong> VC fonlarının AI startuplarına artan ilgisi</li>\n</ul>\n\n<h3>Başarı İçin Kritik Öneriler</h3>\n\n<ol>\n<li><strong>Sürekli Öğrenme:</strong> AI teknolojileri hızla değişiyor, güncel kalın</li>\n<li><strong>Etik Yaklaşım:</strong> Responsible AI prensiplerini benimseyin</li>\n<li><strong>Multidisipliner Takım:</strong> Teknik ve iş geliştirme yeteneklerini birleştirin</li>\n<li><strong>Pilot Projelerle Başlayın:</strong> Büyük yatırımlardan önce küçük projelerle kendinizi kanıtlayın</li>\n<li><strong>Kullanıcı Odaklı Tasarım:</strong> Teknoloji odaklı değil, kullanıcı ihtiyacı odaklı düşünün</li>\n</ol>\n\n<h3>Gelecek Öngörüleri</h3>\n\n<p>2025-2030 döneminde AI girişimciliğinde beklenen trendler:</p>\n\n<ul>\n<li>Edge AI ve IoT entegrasyonları</li>\n<li>Generative AI uygulamalarının yaygınlaşması</li>\n<li>AI as a Service (AIaaS) modellerinin artması</li>\n<li>Sektörel AI çözümlerinin derinleşmesi</li>\n</ul>\n\n<p>AI çağında başarılı olmak için en önemli unsur: teknolojiye hakim olmak kadar, insan ihtiyaçlarını anlamak ve etik değerleri korumak.</p>	guides	/api/media/blog/ai-entrepreneurship.svg	Dr. Mehmet Özkan	2025-01-05 09:15:00	t	41781800	41781800	2025-07-08 09:37:19.44807	2025-07-08 09:37:19.44807	yapay-zeka-caginda-girisimcilik	\N
5	Sürdürülebilir Girişimcilik: Geleceğin İş Modelleri	Çevresel sorumluluk ve kar dengesini kuran sürdürülebilir girişimcilik modelleri, hem topluma fayda sağlıyor hem de uzun vadeli başarı getiriyor.	<h2>Sürdürülebilirlik: Girişimciliğin Yeni DNA'sı</h2>\n\n<p>21. yüzyılın girişimcileri, sadece kar elde etmekle kalmıyor, aynı zamanda gezegen ve toplum için değer yaratıyor. Sürdürülebilir girişimcilik, ekonomik başarı ile çevresel ve sosyal sorumluluk arasında denge kuran yeni bir paradigma sunuyor.</p>\n\n<h3>Sürdürülebilir Girişimciliğin Temel Prensipleri</h3>\n\n<ul>\n<li><strong>Triple Bottom Line:</strong> Kar, İnsan, Gezegen dengesi</li>\n<li><strong>Döngüsel Ekonomi:</strong> Atık minimizasyonu ve geri dönüşüm</li>\n<li><strong>Sosyal Etki:</strong> Toplumsal problemlere çözüm üretme</li>\n<li><strong>Uzun Vadeli Düşünce:</strong> Sürdürülebilir büyüme stratejileri</li>\n<li><strong>Şeffaflık:</strong> Açık ve hesap verebilir işletme modelleri</li>\n</ul>\n\n<h3>Popüler Sürdürülebilir İş Modelleri</h3>\n\n<p><strong>1. Sharing Economy (Paylaşım Ekonomisi)</strong><br>\nKaynakların daha verimli kullanımını sağlayan platformlar. Örnek: Car sharing, co-working spaces.</p>\n\n<p><strong>2. Circular Business Models</strong><br>\nÜrün yaşam döngüsünü uzatan, geri dönüşümü entegre eden modeller.</p>\n\n<p><strong>3. Impact Ventures</strong><br>\nSosyal ve çevresel problemlere odaklanan, ölçülebilir etki yaratan girişimler.</p>\n\n<p><strong>4. Clean Technology</strong><br>\nTemiz enerji, verimli kaynak kullanımı ve çevre dostu teknolojiler.</p>\n\n<h3>Türkiye'den Başarılı Örnekler</h3>\n\n<ul>\n<li><strong>BiTaksi:</strong> Şehir içi ulaşımı optimize eden, karbon ayak izini azaltan platform</li>\n<li><strong>Çöp(m)adam:</strong> Atık geri dönüşümünü dijitalleştiren sosyal girişim</li>\n<li><strong>Tarfin:</strong> Finansal erişimi demokratikleştiren fintech startup</li>\n<li><strong>Ciceksepeti:</strong> Sürdürülebilir ambalajlama ve yerel üretici destekleri</li>\n</ul>\n\n<h3>Sürdürülebilir Girişim Kurma Adımları</h3>\n\n<ol>\n<li><strong>Impact Assessment:</strong> Yaratmak istediğiniz sosyal/çevresel etkiyi tanımlayın</li>\n<li><strong>Stakeholder Mapping:</strong> Tüm paydaşları belirleyin ve önceliklerini anlayın</li>\n<li><strong>Sürdürülebilirlik Stratejisi:</strong> KPI'lar ve ölçüm yöntemleri geliştirin</li>\n<li><strong>Partnership Geliştirme:</strong> NGO'lar, devlet kurumları ve diğer şirketlerle işbirlikleri</li>\n<li><strong>Sertifikasyon:</strong> B-Corp, ISO 14001 gibi sürdürülebilirlik sertifikaları</li>\n</ol>\n\n<h3>Finansman İmkanları</h3>\n\n<p>Sürdürülebilir girişimler için özel finansman kaynakları:</p>\n\n<ul>\n<li><strong>Impact Investors:</strong> Sosyal etki odaklı yatırım fonları</li>\n<li><strong>Green Bonds:</strong> Çevre dostu projeler için tahvil finansmanı</li>\n<li><strong>Grant Programs:</strong> AB, UN ve diğer uluslararası hibeler</li>\n<li><strong>Crowdfunding:</strong> Toplumsal desteğe dayalı fonlama</li>\n<li><strong>Development Finance:</strong> Kalkınma bankaları ve DFI'lar</li>\n</ul>\n\n<h3>Zorluklar ve Çözümler</h3>\n\n<p><strong>Zorluk:</strong> Sürdürülebilirlik maliyetleri<br>\n<strong>Çözüm:</strong> Uzun vadeli değer yaratma ve operasyonel verimlilik</p>\n\n<p><strong>Zorluk:</strong> Karmaşık ölçüm metrikleri<br>\n<strong>Çözüm:</strong> Standardize edilmiş impact measurement araçları</p>\n\n<p><strong>Zorluk:</strong> Pazar eğitimi gereksinimi<br>\n<strong>Çözüm:</strong> Storytelling ve şeffaf iletişim stratejileri</p>\n\n<h3>Gelecek Trendleri</h3>\n\n<ul>\n<li><strong>ESG Entegrasyonu:</strong> Environmental, Social, Governance faktörlerinin iş stratejisine entegrasyonu</li>\n<li><strong>Regenerative Business:</strong> Sadece zarar vermemek değil, aktif olarak iyileştirmek</li>\n<li><strong>Tech for Good:</strong> Teknolojinin sosyal problemleri çözmek için kullanımı</li>\n<li><strong>Stakeholder Capitalism:</strong> Sadece hissedar değil, tüm paydaş değeri</li>\n</ul>\n\n<h3>Sürdürülebilir Girişimci Olmak İçin Tavsiyeler</h3>\n\n<ol>\n<li>Tutkunuz olan bir sosyal/çevresel problemi seçin</li>\n<li>Sistemik çözümler düşünün, semptom değil kök nedene odaklanın</li>\n<li>İşbirliği kültürünü benimseyin, rekabet değil</li>\n<li>Sabırlı olun, sürdürülebilir etki zaman alır</li>\n<li>Sürekli öğrenin, sürdürülebilirlik alanı hızla gelişiyor</li>\n</ol>\n\n<p>Unutmayın: Sürdürülebilir girişimcilik sadece bir trend değil, geleceğin iş yapma şekli. Bu dönüşümün öncüsü olmak, hem toplumsal hem de ekonomik açıdan kazançlı.</p>	blog	/api/media/blog/sustainable-entrepreneurship.svg	Dr. Ayşe Demir	2024-12-28 11:20:00	t	41781800	41781800	2025-07-08 09:37:19.44807	2025-07-08 09:37:19.44807	surdurulebilir-girisimcilik-gelecek-modelleri	\N
6	Fintech Girişimciliği: Türkiye'nin Dijital Finans Devrimi	Türkiye'deki fintech ekosistemi hızla büyürken, bu alanda girişimcilik yapmak isteyenler için büyük fırsatlar doğuyor. Düzenleyici çerçeve ve pazar dinamikleri.	<h2>Fintech: Finansın Dijital Dönüşümü</h2>\n\n<p>Fintech sektörü, Türkiye'de en hızlı büyüyen girişimcilik alanlarından biri. Geleneksel bankacılık hizmetlerini teknoloji ile yeniden tanımlayan bu sektör, milyonlarca kullanıcıya ulaşarak finansal erişimi demokratikleştiriyor.</p>\n\n<h3>Türkiye Fintech Pazarının Durumu</h3>\n\n<ul>\n<li><strong>Pazar Büyüklüğü:</strong> 2024 itibariyle 5,2 milyar TL hacim</li>\n<li><strong>Kullanıcı Sayısı:</strong> 45 milyon aktif dijital bankacılık kullanıcısı</li>\n<li><strong>Startup Sayısı:</strong> 200'den fazla aktif fintech girişimi</li>\n<li><strong>Yatırım:</strong> Son 3 yılda 1,5 milyar dolar yatırım çekildi</li>\n<li><strong>Düzenleyici Destek:</strong> Sandbox programı ve PSD2 uyumu</li>\n</ul>\n\n<h3>Öne Çıkan Fintech Segmentleri</h3>\n\n<p><strong>1. Digital Banking & Neobanks</strong><br>\nTamamen dijital bankacılık deneyimi sunan platformlar. Örnek: Papara, ininal, CEPTETEB.</p>\n\n<p><strong>2. Payment Solutions</strong><br>\nÖdeme sistemleri ve POS çözümleri. Örnek: iyzico, PayU, Craftgate.</p>\n\n<p><strong>3. Lending & Credit</strong><br>\nAlternatif kredi ve finansman çözümleri. Örnek: Jelibon, Figopara, Lendtech.</p>\n\n<p><strong>4. Wealth Management</strong><br>\nYatırım ve varlık yönetimi platformları. Örnek: Gedik Yatırım, Fineks, TEFAS Plus.</p>\n\n<p><strong>5. Insurtech</strong><br>\nSigorta teknolojileri ve mikro sigorta ürünleri. Örnek: Aksigorta Digital, Neova Sigorta.</p>\n\n<h3>Başarılı Türk Fintech Hikayeleri</h3>\n\n<p><strong>Papara:</strong> 2016'da kurulan Papara, 10 milyonu aşan kullanıcı sayısıyla Türkiye'nin en büyük neobank'ı haline geldi.</p>\n\n<p><strong>iyzico:</strong> Ödeme altyapısı sağlayıcısı olarak başlayan iyzico, PayU tarafından satın alınarak global ölçekte büyüdü.</p>\n\n<p><strong>Paraşüt:</strong> KOBİ'lere yönelik muhasebe ve finans yönetimi çözümleri sunan platform, binlerce işletmeye hizmet veriyor.</p>\n\n<h3>Fintech Girişimciliğinde Kritik Faktörler</h3>\n\n<ol>\n<li><strong>Düzenleyici Uyum:</strong> BDDK, SPK ve diğer otoritelerin düzenlemelerine tam uyum</li>\n<li><strong>Güvenlik:</strong> Siber güvenlik ve veri koruma öncelik</li>\n<li><strong>Kullanıcı Deneyimi:</strong> Basit, hızlı ve güvenilir arayüz tasarımı</li>\n<li><strong>Scalability:</strong> Büyük kullanıcı kitlelerine hizmet verebilecek altyapı</li>\n<li><strong>Partnership:</strong> Bankalar ve finans kurumlarıyla stratejik işbirlikleri</li>\n</ol>\n\n<h3>Düzenleyici Çerçeve ve Fırsatlar</h3>\n\n<p><strong>BDDK Sandbox Programı:</strong> Yenilikçi fintech çözümlerini test etme imkanı</p>\n\n<p><strong>Open Banking:</strong> PSD2 uyumu ile üçüncü taraf hizmet sağlayıcıları için fırsatlar</p>\n\n<p><strong>E-Para Lisansı:</strong> Ödeme hizmetleri için düzenlenmiş lisanslama süreci</p>\n\n<p><strong>Kripto Düzenlemeleri:</strong> Dijital varlık hizmetleri için net mevzuat</p>\n\n<h3>Teknolojik Trendler</h3>\n\n<ul>\n<li><strong>Blockchain & DeFi:</strong> Merkeziyetsiz finans uygulamaları</li>\n<li><strong>AI & ML:</strong> Risk değerlendirme ve fraud detection</li>\n<li><strong>Biometric Authentication:</strong> Biyometrik kimlik doğrulama</li>\n<li><strong>IoT Payments:</strong> Nesnelerin interneti ödemeleri</li>\n<li><strong>Voice Banking:</strong> Sesli bankacılık hizmetleri</li>\n</ul>\n\n<h3>Yatırımcı ve Finansman İmkanları</h3>\n\n<p>Türkiye'deki fintech yatırım ekosistemi:</p>\n\n<ul>\n<li><strong>VC Fonları:</strong> 212, Revo Capital, Turkish Airlines Ventures</li>\n<li><strong>Corporate VC:</strong> QNB Finans Lab, Garanti BBVA, Akbank gibi kurumsal girişim fonları</li>\n<li><strong>International Funds:</strong> Emergence Capital, Greycroft gibi global yatırımcılar</li>\n<li><strong>Government Support:</strong> TÜBİTAK ve KOSGEB fintech destekleri</li>\n</ul>\n\n<h3>Pazar Analizi ve Hedef Kitle</h3>\n\n<p><strong>Gen Z ve Millennials:</strong> Dijital natif kullanıcılar, %70 fintech adoption oranı</p>\n\n<p><strong>KOBİ'ler:</strong> Finansal hizmetlere erişim zorluğu çeken 3,2 milyon işletme</p>\n\n<p><strong>Bankamatik Kullanıcıları:</strong> 85% akıllı telefon penetrasyonu olan kullanıcılar</p>\n\n<p><strong>Rural Markets:</strong> Geleneksel bankacılık hizmetlerinin sınırlı olduğu bölgeler</p>\n\n<h3>Başarı İçin Stratejik Öneriler</h3>\n\n<ol>\n<li><strong>Niche Focus:</strong> Spesifik bir segment veya problem üzerine odaklanın</li>\n<li><strong>MVP Approach:</strong> Minimal features ile hızlıca piyasaya çıkın</li>\n<li><strong>Data-Driven:</strong> Kullanıcı davranışlarını analiz ederek ürün geliştirin</li>\n<li><strong>Compliance First:</strong> Düzenleyici gereklilikleri en baştan planlayın</li>\n<li><strong>Customer Education:</strong> Finansal okuryazarlık ve ürün eğitimi verin</li>\n</ol>\n\n<h3>Gelecek Perspektifi</h3>\n\n<p>2025-2030 döneminde Türk fintech sektöründe beklenen gelişmeler:</p>\n\n<ul>\n<li>Central Bank Digital Currency (CBDC) pilot uygulamaları</li>\n<li>Embedded finance ürünlerinin yaygınlaşması</li>\n<li>AI-driven kişiselleştirilmiş finansal danışmanlık</li>\n<li>Sustainability-focused fintech çözümleri</li>\n<li>Cross-border payment çözümlerinin gelişmesi</li>\n</ul>\n\n<p>Fintech girişimciliği, hem teknik yetenek hem de finansal piyasa bilgisi gerektiren karmaşık bir alan. Ancak doğru strateji ve ekseküsyon ile, toplumsal etki yaratırken büyük ticari başarılar elde etmek mümkün.</p>	blog	/api/media/blog/fintech-entrepreneurship.svg	Cem Karataş	2025-08-27 10:27:18.543	t	41781800	admin-user	2025-07-08 09:37:19.44807	2025-08-27 10:27:18.543	fintech-girisimciligi-dijital-finans-devrimi	\N
7	Kadın Girişimciliği: Engelleri Aşmak ve Başarıya Ulaşmak	Türkiye'de kadın girişimcilerin karşılaştığı zorluklar ve bunları aşmanın yolları. Başarılı kadın girişimci hikayeleri ve destekleyici ekosistem.	<h2>Kadın Girişimciliğinin Gücü</h2>\n\n<p>Kadın girişimciler, ekonomik büyümenin önemli motorlarından biri. Türkiye'de kadın girişimci oranı %38 ile dünya ortalamasının üzerinde olmasına rağmen, karşılaşılan engeller ve fırsatlar hâlâ eşit değil.</p>\n\n<h3>Türkiye'de Kadın Girişimciliğinin Mevcut Durumu</h3>\n\n<ul>\n<li><strong>Girişimci Oranı:</strong> Türkiye'deki girişimcilerin %38'i kadın</li>\n<li><strong>Sektörel Dağılım:</strong> %45 hizmet, %30 ticaret, %25 üretim</li>\n<li><strong>Eğitim Seviyesi:</strong> Kadın girişimcilerin %60'ı üniversite mezunu</li>\n<li><strong>Yaş Ortalaması:</strong> 35-45 yaş arası en aktif dönem</li>\n<li><strong>Finansman:</strong> %70'i kendi birikimlerini kullanıyor</li>\n</ul>\n\n<h3>Karşılaşılan Temel Engeller</h3>\n\n<p><strong>1. Finansmana Erişim Zorluğu</strong><br>\nKadın girişimciler, krediye erişimde erkek meslektaşlarına göre %20 daha fazla zorluk yaşıyor.</p>\n\n<p><strong>2. İş-Yaşam Dengesi</strong><br>\nGeleneksel toplumsal roller, özellikle anne olan kadınlar için ek zorluklar yaratıyor.</p>\n\n<p><strong>3. Network ve Mentorship Eksikliği</strong><br>\nİş ağları ve deneyimli mentor eksikliği, büyüme sürecini yavaşlatıyor.</p>\n\n<p><strong>4. Önyargılar ve Stereotipler</strong><br>\nÖzellikle teknoloji ve üretim sektörlerinde cinsiyet önyargıları mevcut.</p>\n\n<h3>Başarılı Türk Kadın Girişimciler</h3>\n\n<p><strong>Nevzat Aydin (Yemeksepeti):</strong> Co-founder olarak Türkiye'nin en büyük çıkışlarından birini gerçekleştirdi.</p>\n\n<p><strong>Meltem Demirel (UNILEVER):</strong> Sürdürülebilirlik alanında öncü projeler geliştiren girişimci.</p>\n\n<p><strong>Arzum Doğan (Arzum):</strong> Aile şirketini modern bir ev aletleri markasına dönüştürdü.</p>\n\n<p><strong>Sedef Buçukçu (Opet):</strong> Enerji sektöründe dijital dönüşümü liderlik eden executive.</p>\n\n<h3>Destekleyici Ekosistem ve Programlar</h3>\n\n<p><strong>KAGIDER (Kadın Girişimci Derneği):</strong></p>\n<ul>\n<li>Mentorship programları</li>\n<li>Networking etkinlikleri</li>\n<li>Eğitim ve sertifikasyon programları</li>\n<li>Yurtdışı pazar erişimi destekleri</li>\n</ul>\n\n<p><strong>Türkiye İş Bankası Kadın Girişimci Programı:</strong></p>\n<ul>\n<li>Özel finansman koşulları</li>\n<li>İş geliştirme danışmanlığı</li>\n<li>Dijital pazarlama eğitimleri</li>\n<li>E-ticaret platformu destekleri</li>\n</ul>\n\n<p><strong>AB Destekleri:</strong></p>\n<ul>\n<li>Horizon Europe - Women in Innovation</li>\n<li>COSME - Women Entrepreneurship</li>\n<li>Erasmus for Young Entrepreneurs</li>\n</ul>\n\n<h3>Sektörel Fırsatlar</h3>\n\n<p><strong>1. E-ticaret ve Dijital Pazarlama</strong><br>\nCOVID-19 sonrası büyüyen online ticaret, kadın girişimciler için büyük fırsatlar sunuyor.</p>\n\n<p><strong>2. Sağlık ve Wellness</strong><br>\nArtan sağlık bilinci, bu alanda yenilikçi çözümler için talep yaratıyor.</p>\n\n<p><strong>3. Eğitim Teknolojileri</strong><br>\nEdTech sektöründe kadın girişimciler önemli başarılar elde ediyor.</p>\n\n<p><strong>4. Sürdürülebilirlik ve Sosyal Girişimcilik</strong><br>\nÇevresel ve sosyal sorunlara odaklanan girişimlerde kadınlar öncü rol oynuyor.</p>\n\n<h3>Başarı Stratejileri</h3>\n\n<ol>\n<li><strong>Net Hedef Belirleme:</strong> Kısa ve uzun vadeli hedeflerinizi netleştirin</li>\n<li><strong>Güçlü Network Kurma:</strong> Sektörünüzdeki diğer girişimcilerle bağlantı kurun</li>\n<li><strong>Mentor Bulma:</strong> Deneyimli girişimcilerden mentorluk alın</li>\n<li><strong>Finansal Okuryazarlık:</strong> Mali yönetim becerilerinizi geliştirin</li>\n<li><strong>Dijital Beceriler:</strong> Teknolojik dönüşüme ayak uydurun</li>\n<li><strong>Özgüven Geliştirme:</strong> Kendi değerinizi bilmeyi öğrenin</li>\n</ol>\n\n<h3>Finansman Alternatifleri</h3>\n\n<ul>\n<li><strong>Mikrofinans Kurumları:</strong> Küçük tutarlı krediler</li>\n<li><strong>Crowdfunding:</strong> Topluluk destekli fonlama</li>\n<li><strong>Angel Investors:</strong> Kadın girişimcilere odaklanan bireysel yatırımcılar</li>\n<li><strong>VC Fonları:</strong> Female-focused yatırım fonları</li>\n<li><strong>Hibeler:</strong> Devlet ve AB hibeleri</li>\n<li><strong>İşletme Kredileri:</strong> Banka kredilerinde özel koşullar</li>\n</ul>\n\n<h3>Teknoloji ve Dijitalleşme</h3>\n\n<p>Dijital araçlar, kadın girişimciler için oyun değiştirici:</p>\n\n<ul>\n<li><strong>E-ticaret Platformları:</strong> Fiziksel mağaza ihtiyacını ortadan kaldırıyor</li>\n<li><strong>Sosyal Medya Pazarlama:</strong> Düşük maliyetli pazarlama imkanı</li>\n<li><strong>Cloud Computing:</strong> Kurumsal teknolojilere erişimi demokratikleştiriyor</li>\n<li><strong>Remote Work:</strong> Coğrafi sınırları ortadan kaldırıyor</li>\n</ul>\n\n<h3>Gelecek Perspektifi</h3>\n\n<p>2025-2030 döneminde kadın girişimciliğinde beklenen gelişmeler:</p>\n\n<ul>\n<li>Fintech alanında kadın girişimci oranının artması</li>\n<li>Sürdürülebilirlik odaklı girişimlerin çoğalması</li>\n<li>AI ve veri analitiği alanında kadın liderliğinin güçlenmesi</li>\n<li>Work-life balance çözümlerinde yenilikçi yaklaşımlar</li>\n</ul>\n\n<h3>Başarı İçin Son Tavsiyeler</h3>\n\n<ol>\n<li><strong>Cesur Olun:</strong> Risk almaktan korkmayın, hesaplı adımlar atın</li>\n<li><strong>Sürekli Öğrenin:</strong> Sektörünüzdeki gelişmeleri takip edin</li>\n<li><strong>Collaboration:</strong> Rekabet değil, işbirliği odaklı düşünün</li>\n<li><strong>Role Model Olun:</strong> Diğer kadınlar için ilham kaynağı olun</li>\n<li><strong>Değerinizi Bilin:</strong> Başarılarınızı görünür kılın</li>\n</ol>\n\n<p>Kadın girişimciliği, sadece ekonomik değil, sosyal dönüşümün de anahtarı. Her başarılı kadın girişimci, gelecek nesillere örnek teşkil ediyor ve cam tavanı kırıyor.</p>	blog	/api/media/blog/women-entrepreneurship.svg	Prof. Dr. Zeynep Özcan	2024-12-15 13:30:00	t	41781800	41781800	2025-07-08 09:37:19.44807	2025-07-08 09:37:19.44807	kadin-girisimciligi-engelleri-asmak	\N
2	Türkiye'de Girişimcilik Ekosistemi: 2025 Perspektifi	Türkiye'nin dinamik girişimcilik ekosistemi, genç yetenekler ve teknolojik dönüşümle hızla büyüyor. 2025 yılında bizi bekleyen fırsatları keşfedin.	<h2>Türkiye'nin Değişen Girişimcilik Manzarası</h2>\n\n<p>Son yıllarda Türkiye, güçlü bir girişimcilik ekosistemi geliştirdi. Özellikle teknoloji, fintech ve e-ticaret alanlarında başarılı örnekler ortaya çıktı. Bu dönüşümün arkasında:</p>\n\n<ul>\n<li><strong>Genç ve Dinamik Nüfus:</strong> Türkiye'nin ortalama yaşı 33,1 olan nüfusu, girişimcilik için büyük bir potansiyel oluşturuyor</li>\n<li><strong>Teknolojik Altyapı:</strong> Dijital dönüşüm yatırımları, startup'ların hızla büyümesini destekliyor</li>\n<li><strong>Devlet Destekleri:</strong> KOSGEB, TÜBİTAK ve benzeri kurumların sağladığı finansal destekler</li>\n<li><strong>Uluslararası Yatırımcı İlgisi:</strong> Küresel fonların Türk startup'larına olan ilgisi artıyor</li>\n</ul>\n\n<h3>2025 Yılında Öne Çıkacak Sektörler</h3>\n\n<p><strong>1. Yapay Zeka ve Makine Öğrenmesi</strong><br>\nTürk girişimciler, AI teknolojilerini yerel ihtiyaçlara uyarlayarak global pazarlara açılıyor.</p>\n\n<p><strong>2. Sürdürülebilir Teknolojiler</strong><br>\nÇevre dostu çözümler sunan startup'lar, hem yerel hem de uluslararası yatırımcıların dikkatini çekiyor.</p>\n\n<p><strong>3. Sağlık Teknolojileri</strong><br>\nPandemi sonrası artan sağlık bilinci, bu alandaki girişimleri tetikliyor.</p>\n\n<h3>Başarılı Türk Startup Örnekleri</h3>\n\n<p>Peak Games, Getir, Trendyol gibi unicorn'lar, Türkiye'nin girişimcilik potansiyelini dünyaya kanıtladı. Bu başarı hikayelerinden öğrenebileceğimiz önemli dersler var:</p>\n\n<ul>\n<li>Yerel pazarı iyi anlayıp, küresel vizyonla hareket etmek</li>\n<li>Teknolojik yenilikleri kullanıcı deneyimiyle birleştirmek</li>\n<li>Sürekli öğrenme ve adaptasyon kültürü geliştirmek</li>\n</ul>\n\n<h3>Geleceğe Bakış</h3>\n\n<p>2025 yılında Türkiye'nin girişimcilik ekosistemi daha da güçlenecek. Özellikle:</p>\n\n<ul>\n<li>Venture capital yatırımlarının artması</li>\n<li>Universitelerin girişimcilik merkezlerinin yaygınlaşması</li>\n<li>Mentorship programlarının gelişmesi</li>\n<li>Uluslararası işbirliklerin artması</li>\n</ul>\n\n<p>Bu dinamik ortamda yer almak isteyen girişimciler için en önemli tavsiye: cesur olmak, öğrenmeye açık kalmak ve ağ kurmaya odaklanmak.</p>	blog	/api/media/blog/turkey-startup-ecosystem.svg	Dr. Ahmet Yılmaz	2025-08-27 10:26:45.015	t	41781800	admin-user	2025-07-08 09:37:19.44807	2025-08-27 10:26:45.017	turkiyede-girisimcilik-ekosistemi-2025	\N
8	Blockchain ve Kripto Girişimciliği: Web3'ün Geleceği	Blockchain teknolojisi ve kripto ekosistemi, yeni nesil girişimciler için devrim niteliğinde fırsatlar sunuyor. Web3 dünyasında başarılı olmak için bilinmesi gerekenler.	<h2>Web3 ve Blockchain: Girişimciliğin Yeni Sınırı</h2>\n\n<p>Blockchain teknolojisi ve kripto ekosistemi, geleneksel iş modellerini yeniden tanımlıyor. Web3, merkeziyetsizlik, şeffaflık ve kullanıcı kontrolü prensipleriyle, girişimcilere sınırsız imkanlar sunuyor.</p>\n\n<h3>Blockchain Girişimciliğinin Temel Alanları</h3>\n\n<ul>\n<li><strong>DeFi (Decentralized Finance):</strong> Geleneksel finansal hizmetlerin merkeziyetsiz alternatifleri</li>\n<li><strong>NFT ve Digital Assets:</strong> Dijital varlık yaratma ve ticareti</li>\n<li><strong>DAOs:</strong> Merkeziyetsiz otonom organizasyonlar</li>\n<li><strong>Web3 Infrastructure:</strong> Blockchain altyapı hizmetleri</li>\n<li><strong>GameFi:</strong> Oyun ve finans entegrasyonu</li>\n</ul>\n\n<p>[İçerik devam ediyor...]</p>	guides	/api/media/blog/blockchain-web3.svg	Dr. Emre Kılıç	\N	f	41781800	41781800	2025-07-08 09:37:41.244765	2025-07-08 09:37:41.244765	blockchain-kripto-girisimciligi-web3	\N
9	Gelecek Nesil Liderlik: Z Kuşağı Girişimcilerin Yükselişi	Z kuşağı girişimciler, dijital natif özellikleri ve farklı değer sistemleriyle iş dünyasını dönüştürüyor. Bu yeni neslin özellikleri ve potansiyeli.	<h2>Z Kuşağı: Dijital Çağın Girişimcileri</h2>\n\n<p>1997-2012 yılları arasında doğan Z kuşağı, tamamen dijital bir dünyada büyüdü. Bu nesil, teknoloji ile doğal bir bağlantıya sahip ve geleneksel iş modellerini sorgulayan bir yaklaşımla girişimciliğe yaklaşıyor.</p>\n\n<h3>Z Kuşağı Girişimcilerin Özellikleri</h3>\n\n<ul>\n<li><strong>Dijital Natif:</strong> Teknoloji ile doğal etkileşim</li>\n<li><strong>Sosyal Bilinç:</strong> Sürdürülebilirlik ve sosyal sorumluluk odaklı</li>\n<li><strong>Hızlı Adaptasyon:</strong> Değişime açıklık ve esneklik</li>\n<li><strong>Global Perspektif:</strong> Sınırsız pazar düşüncesi</li>\n<li><strong>Purpose-Driven:</strong> Amaç odaklı iş modelleri</li>\n</ul>\n\n<p>[İçerik devam ediyor...]</p>	blog	/api/media/blog/gen-z-leadership.svg	Merve Öztürk	\N	f	41781800	41781800	2025-07-08 09:37:41.244765	2025-07-08 09:37:41.244765	gelecek-nesil-liderlik-z-kusagi-girisimciler	\N
12	Yapay Zeka ve Yeni Nesil Girişimcilik Semineri Başarıyla Gerçekleştirildi	İTÜ GİNOVA tarafından düzenlenen Town Hall Semineri'nde İş Bankası Yapay Zeka Fabrikası koordinatörü Kadir Bulut ile yapay zekanın girişimcilik ekosistemindeki rolü konuşuldu.	İstanbul Teknik Üniversitesi Girişimcilik ve İnovasyon Merkezi (GİNOVA) tarafından düzenlenen Town Hall Seminer Serisi kapsamında gerçekleştirilen "Yapay Zeka ve Yeni Nesil Girişimcilik Semineri" büyük ilgi gördü.\n\n14 Şubat 2024 tarihinde İTÜ Ayazağa Yerleşkesi MED A-A15 salonunda düzenlenen etkinlikte, Türkiye İş Bankası bünyesinde faaliyet gösteren Yapay Zeka Fabrikası'nın koordinatörü Kadir Bulut, İTÜ öğrencileriyle bir araya geldi.\n\n## Yeni Nesil Girişimcilik Odağında Yapay Zeka\n\nTopluma etki eden yenilikçi fikir ve tasarılar ortaya koyma hedefine dayanan "Yeni Nesil Girişimcilik" kavramını odağına alan toplantıda, yapay zekanın girişimcilik ekosisteminde üstlendiği güncel rol ve oluşturduğu fırsatlar mercek altına alındı.\n\nYapay zeka teknolojilerinin nasıl daha etkin bir şekilde kullanılabileceği hakkında görüşlerin anlatıldığı programda ayrıca öğrencilerin girişim fikirlerini paylaştıkları interaktif bir ortama da yer verildi.\n\n## İnteraktif Katılım ve Fikir Paylaşımı\n\nSeminerde öğrenciler, kendi girişim fikirlerini sunma ve yapay zeka teknolojilerinin bu fikirlerle nasıl entegre edilebileceği konusunda uzmanlardan geri bildirim alma fırsatı buldular. Bu interaktif yaklaşım, teorik bilgilerin pratiğe dönüştürülmesi açısından önemli bir değer sağladı.\n\nEtkinlik, İTÜ GİNOVA'nın girişimcilik ekosistemini destekleme misyonunun bir parçası olarak düzenlenmiş ve katılımcılardan yoğun ilgi görmüştür.	Etkinlik	/api/media/events/yapay-zeka-girisimcilik-semineri.jpg	İTÜ Medya ve İletişim Ofisi	2024-02-15 10:00:00	t	admin-user	admin-user	2024-02-15 10:00:00	2024-02-15 10:00:00	yapay-zeka-yeni-nesil-girisimcilik-semineri-2024	\N
16	İTÜ GİNOVA Jump Start ile Yeni Girişimcilik Dönemi Başladı	İTÜ GİNOVA'nın düzenlediği Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı, 2025 Bahar Dönemi'nde girişimci adaylarını buluşturdu.	İstanbul Teknik Üniversitesi Girişimcilik ve İnovasyon Merkezi (İTÜ GİNOVA) tarafından her dönem düzenlenen "Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı", 2024-2025 Bahar Dönemi eğitimlerine 19 Mart 2025'te başladı.\n\n## Güçlü Açılış Dersi\n\nAçılış dersi, Doç. Dr. Adnan Veysel Ertemel tarafından verilen "Girişimciliğe Hızlı Başlangıç" eğitimi ile yapıldı. Eğitime, girişimcilik ekosisteminin önemli isimlerden biri olan GOBI Partners'ın General Partneri Erdem Dereli de konuk olarak katılarak deneyimlerini katılımcılarla paylaştı.\n\n## 5 Haftalık Yoğun Program\n\nBeş hafta sürecek program boyunca girişimci adayları, iş fikirlerini test etmek, iş modeli oluşturmak ve yatırımcı sunumlarına hazırlanmak için çeşitli eğitimler alacak. Katılımcılar, aşağıdaki kritik konularda uzmanlaşacak:\n\n### Eğitim Modülleri\n- **Herkes için Design Thinking**: İnsan odaklı tasarım yaklaşımı\n- **Girişimciler için Teknoloji Ticarileştirme ve Lisanslama Stratejileri**: Teknoloji transferi ve IP yönetimi\n- **Deney Tasarımı Atölyesi**: Minimum Viable Product (MVP) geliştirme\n- **İş Modeli Tasarımı**: Sürdürülebilir iş modelleri oluşturma\n- **Girişimi Yatırıma Hazırlamak**: Yatırımcı sunumu ve pitch teknikleri\n\n## Demo Day'e Doğru\n\nHer Çarşamba düzenlenecek eğitimler, 14 Mayıs 2025'te gerçekleşecek Demo Day ile sona erecek. Katılımcılar, "Girişimi Yatırıma Hazırlamak" başlıklı atölye ile sunum becerilerini geliştirerek final etkinliğine hazırlanacak.\n\n## Asenkron Eğitim İmkânı\n\nProgram süresince katılımcılar, senkron eğitimlerin yanı sıra asenkron eğitim modüllerinden de faydalanabilecek. Bu yaklaşım, farklı zaman dilimlerinde çalışan girişimci adaylarına esneklik sağlıyor.\n\n## Sertifika ve Destekler\n\nEğitimi başarıyla tamamlayanlar, aşağıdaki fırsatlara sahip olacak:\n- 30 saatlik eğitim tamamlama sertifikası\n- Mikro kredi desteği\n- 1773 İTÜ Teknopark'ın ileri aşama girişimcilik programlarına katılma hakkı\n- Yatırımcılarla bir araya gelme imkânı\n- Uzman mentörlerden danışmanlık alma fırsatı\n\n## Devam Eden Destek\n\nJump Start programı, devam modülleriyle önümüzdeki haftalarda girişimcilere rehberlik etmeye devam edecek. Bu süreklilik, katılımcıların edindiği bilgileri pratiğe dökme ve projelerini geliştirme sürecinde desteklenmelerini sağlıyor.\n\nİTÜ GİNOVA'nın bu kapsamlı programı, Türkiye'nin girişimcilik ekosisteminde yeni nesil girişimcilerin yetişmesine önemli katkı sağlamaya devam ediyor.	Etkinlik	/api/media/events/ginova-jump-start-2025.jpg	İTÜ Medya ve İletişim Ofisi	2025-03-26 18:00:00	t	admin-user	admin-user	2025-03-26 18:00:00	2025-03-26 18:00:00	ginova-jump-start-yeni-girisimcilik-donemi-2025	\N
11	Find Your Co-Founder Etkinliği Başarıyla Gerçekleşti	İTÜ GİNOVA tarafından düzenlenen "Find Your Co-Founder" etkinliği, farklı disiplinlerden öğrencileri bir araya getirerek inovatif projeler için ortaklık fırsatları sundu.	İstanbul Teknik Üniversitesi, 250. yaşında girişimci öğrencilerin ufkunu açacak, yaratıcılığını ve işbirliğini arttıracak etkinliklere ev sahipliği yapmayı sürdürüyor. 17 Mayıs 2023 tarihinde İTÜ GİNOVA tarafından gerçekleştirilen "Find Your Co-Founder" etkinliği, iş fikirlerine proje ortağı bulmak isteyen öğrencileri bir araya getirdi.\n\n## Disiplinler Arası İşbirliği\n\nİTÜ Yazılım Kulübü'nden öğrencilerin yanı sıra, endüstriyel tasarım ve farklı mühendislik bölümlerinden öğrencilerin de yoğun katılım gösterdiği etkinlik, disiplinler arası işbirliğinin önemini bir kez daha ortaya koydu. Katılımcılar birbirleriyle tanışarak inovatif proje fikirlerini paylaştılar.\n\n## Networking ve Geri Bildirim\n\nEtkinlik boyunca öğrenciler:\n- Proje fikirlerini diğer katılımcılarla paylaştı\n- Projelerine yönelik değerli geri bildirimler aldı\n- Farklı disiplinlerden ihtiyaç duydukları ortaklarla tanıştı\n- Networking fırsatlarından yararlandı\n\n## Sürdürülebilir Bir Platform\n\nÖğrencilere projelerine farklı bakış açıları ve partnerler kazandıran "Find Your Co-founder" etkinliği, düzenli hale getirilerek farklı disiplinlerden öğrencilerin buluştuğu sürdürülebilir bir platforma dönüştürülecek.\n\nBu etkinlik, İTÜ'deki girişimcilik ekosistemini güçlendiren önemli adımlardan biri olarak kayıtlara geçti. Gelecekte de benzer etkinliklerle öğrencilerimizin girişimcilik yolculuklarını desteklemeye devam edeceğiz.	news	/api/media/events/find-your-co-founder.jpg	İTÜ GİNOVA	2023-05-17 10:00:00	t	\N	admin-user	2023-05-17 10:00:00	2025-08-27 10:44:51.78	find-your-co-founder-etkinligi-basariyla-gerceklesti	\N
13	Find Your Co-Founder Etkinliği Başarıyla Gerçekleştirildi	İTÜ GİNOVA'nın düzenlediği "Find Your Co-Founder" etkinliğinde farklı disiplinlerden öğrenciler bir araya gelerek proje ortakları bulma fırsatı yakaladı.	İstanbul Teknik Üniversitesi, Girişim ve İnovasyon Merkezi (İTÜ GİNOVA) tarafından düzenlenen "Find Your Co-Founder" Etkinliği, 28 Şubat 2024 tarihinde İTÜ Ayazağa Yerleşkesi, Merkezi Derslik binasında başarıyla gerçekleştirildi.\n\n## Farklı Disiplinlerin Buluşması\n\nYazılımdan endüstriyel tasarıma kadar birçok farklı disiplinden öğrenciyi bir araya getiren bu özel etkinlik, girişimcilik ekosisteminde işbirliğinin önemini vurgulayan anlamlı bir buluşma oldu.\n\n## Proje Sunumları ve Networking\n\nEtkinlik kapsamında katılımcılar proje sunumları gerçekleştirerek, dinleyicilerden değerli geri bildirimlerin yanında diğer disiplinlerden potansiyel iş ortaklarıyla tanışma imkânına kavuştu. Bu interaktif format, öğrencilerin fikirlerini paylaşması ve farklı bakış açılarından faydalanması için ideal bir ortam sağladı.\n\n## Açılış Konuşması ve Uzman Görüşleri\n\nEtkinliğin açılış konuşmasında ortak iş yapma kültürünün önemine dikkat çeken İTÜ GİNOVA Genel Müdürü Doç. Dr. Adnan Veysel Ertemel, girişimcilik dünyasındaki güncel gelişmeleri dinleyicilerle paylaştı. Ayrıca, etkili konuşma ve sunum yapmanın önemine vurgu yaparak detaylı bilgiler sundu.\n\nBu tür etkinlikler, İTÜ'nün girişimcilik ekosistemindeki öncü rolünü pekiştirirken, öğrencilerin interdisipliner projelerde yer almasını teşvik ediyor.	Etkinlik	/api/media/events/find-your-co-founder-2024.jpg	İTÜ Medya ve İletişim Ofisi	2024-02-29 09:00:00	t	admin-user	admin-user	2024-02-29 09:00:00	2024-02-29 09:00:00	find-your-co-founder-etkinligi-2024-basarili	\N
14	STEM's Zirvesi: Sürdürülebilir Gelecek İçin Başarıyla Gerçekleştirildi	İTÜ İşletme Mühendisliği Bölümü ve İTÜ GİNOVA işbirliğinde düzenlenen STEM's Zirvesi, bilim, teknoloji, mühendislik ve matematik alanlarında sürdürülebilirlik odaklı bir deneyim sundu.	İstanbul Teknik Üniversitesi, İşletme Mühendisliği Bölümü ve İTÜ GİNOVA (Girişimcilik ve İnovasyon Merkezi) işbirliğiyle düzenlenen ve "Sürdürülebilir bir gelecek için" sloganıyla hazırlanan STEM's Zirvesi, 6-7 Aralık 2022 tarihlerinde İTÜ Ayazağa Yerleşkesi'nde başarıyla gerçekleştirildi.\n\n## Hibrit Katılım İmkânı\n\nSüleyman Demirel Kültür Merkezi'nde hibrit olarak gerçekleştirilen zirve, katılımcılarına hem fiziki hem de çevrimiçi katılım imkânı sundu. Bu format sayesinde Türkiye'nin farklı şehirlerinden öğrenciler ve profesyoneller etkinliğe dahil olabildi.\n\n## Özel Sektör ve Akademinin Buluşması\n\nTürkiye'den özel sektörün markalaşmış isimleriyle İTÜ'lüleri bir araya getiren zirve, GİNOVA'nın ülkemizin girişimcilik ve inovasyon ekosistemine katkıları üzerinde de durdu.\n\n## Açılış Töreni\n\nSTEM's Zirvesi'nin açılış törenine İTÜ Rektör Yardımcısı Prof. Dr. Bülent Güloğlu, İTÜ İşletme Mühendisliği Bölüm Başkanı Prof. Dr. Hatice Camgöz Akdağ, İTÜ Ginova Müdürü Doç. Dr. Adnan Veysel Ertemel, öğretim üyeleri ve çok sayıda öğrenci katıldı.\n\nProf. Dr. Hatice Camgöz Akdağ, açılış konuşmasında zirvenin sürdürülebilirlik meraklılarını öğretim üyeleri ve öğrencilerle bir araya getirdiğini vurgularken, "Bilim, teknoloji, mühendislik ve matematiğin yanı sıra girişimcilik ve inovasyonun da konuşulacağı öğretici ve yaratıcı bir zirve" olduğunu belirtti.\n\n## Geleceği Dönüştüren Girişimci Üniversite Vizyonu\n\nProf. Dr. Bülent Güloğlu, "Dünya değişirken meslekler ve işgücü piyasası da değişiyor. Dijital dönüşümle birlikte yeni meslekler ortaya çıktı. Bu durum, eğitimin her zaman güncel tutulması zorunluluğunu ortaya çıkarıyor" diyerek değişen dünyada eğitimin önemine değindi.\n\n"STEM alanlarına hâkim olmanın yanında girişimci ve inovatif bir düşünce yapısı kazanılması gerekiyor. İTÜ, sahip olduğu GİNOVA, TTO gibi birimleriyle ve sayısını arttıracağı kuluçka merkezleriyle girişimciliği daha fazla ön plana çıkaracaktır" şeklinde devam eden konuşmasında İTÜ'nün girişimci üniversite vizyonunu anlattı.\n\n## Kapsamlı Program\n\nZirve süresince İTÜ öğretim üyeleri ve özel sektörden konuşmacılar, STEM'in dünyanın sorunlarını çözme potansiyeli, kadınların STEM konularına katılımının arttırılması, değişim için plan oluşturma, öğrencileri çözüm yaratıcıları olmaya teşvik eden tasarım odaklı düşünme deneyimleri gibi konuları ele aldı.\n\n"Gelecek burada", "gelecek sensin", "STEM sürdürülebilir teknolojiler ile geleceği şekillendirmek", "Türkiye ekosistemi", "veteran ve genç girişimciler ile yatırımcılar" gibi başlıklar altında zengin içerikler sunuldu.\n\nSunumlar ve konuşmaların yanı sıra kahve sohbetleri ve eğitimlerle katılımcılara sürdürülebilirliği özümseme konusunda zengin bir deneyim yaşatıldı. Sürdürülebilirliği önceleyen firmaların stantlarında öğrenciler özel sektör temsilcileriyle fikir alışverişinde bulundu.	Etkinlik	/api/media/events/stems-zirvesi-2022.jpg	İTÜ Medya ve İletişim Ofisi	2022-12-08 15:00:00	t	admin-user	admin-user	2022-12-08 15:00:00	2022-12-08 15:00:00	stems-zirvesi-surdurulebilir-gelecek-2022-basarili	\N
22	İTÜ GİNOVA Demo Day 2023: Genç Girişimciler Fikirlerini Sahneye Taşıdı	İTÜ GİNOVA'nın düzenlediği Demo Day etkinliğinde 12 takım girişimcilik fikirlerini yatırımcı ve akademisyen jürisine sundu.	<p> İTÜ GİNOVA Demo Day 2023: Genç Girişimciler Fikirlerini Sahneye Taşıdı İstanbul Teknik Üniversitesi (İTÜ), geleceği dönüştürme vizyonunun aktif öğrenme çalışmalarıyla öğrenci girişimciliğini teşvik ediyor. İTÜ GİNOVA, girişimciliğe ilgi duyan öğrencilerimize yönelik düzenlediği Jump Start Girişimcilik Programı kapsamında 22 Kasım 2023 tarihinde Demo Day etkinliği gerçekleştirdi. ![Demo Day 2023 Tanıtım](/api/media/blog/genc-girisimciler-demo-day-2023/demo-day-tanitim.png) ## Yoğun Eğitim Süreci Girişimci fikirleriyle katılımcılar **18 Ekim – 22 Kasım** tarihleri arasında düzenlenen kapsamlı eğitim ve atölye çalışmalarına dahil oldular. Bu 5 haftalık yoğun program boyunca öğrenciler: - İş fikirlerini geliştirme - Sunum becerilerini iyileştirme - Pitch teknikleri öğrenme - İş modeli oluşturma fırsatlarını yakaladılar. ![Demo Day Sunum Anı](/api/media/blog/genc-girisimciler-demo-day-2023/demo-day-sunum-1.jpg) ## Jüri Karşısında Büyük Finale Demo Day'da yatırımcı ve akademisyenlerden oluşan deneyimli jüri karşısına çıkan İTÜ'lü öğrencilerin oluşturduğu **12 takım**, girişimcilik fikirlerini profesyonel bir ortamda anlattı. Her takım, aylar boyunca geliştirdikleri projelerini etkileyici sunumlarla jüriye tanıttı. ![Demo Day Jüri Değerlendirmesi](/api/media/blog/genc-girisimciler-demo-day-2023/demo-day-sunum-2.jpg) ## Kazanan Projeler Yapılan titiz değerlendirme sonunda dereceye giren üç girişim şöyle sıralandı: ### 🥇 1. E-Dison AI **E-Şarj operasyonel süreçlerin yapay zekâ destekli etkili biçimde yönetilmesini sağlayan bütünleşik/modüler çözüm** E-Dison AI, elektrikli araç şarj istasyonlarının operasyonel süreçlerini yapay zeka ile optimize eden yenilikçi bir platform geliştirdi. ### 🥈 2. The Cleaner Rings **Toplu taşıma araçlarında sıfır bulaş hedefiyle geliştirilen yenilikçi çözüm** Pandemi sonrası dönemde toplu taşıma güvenliğini artırmayı hedefleyen bu proje, temassız çözümler sunuyor. ### 🥉 3. AllergyBuddy **Alerjen gıdalarla ilgili bir mobil uygulama** Gıda alerjisi olan kişilerin güvenli beslenme alışkanlıkları geliştirmelerine yardımcı olan mobil platform. ![Demo Day Sunum Atmosferi](/api/media/blog/genc-girisimciler-demo-day-2023/demo-day-sunum-3.jpg) ## Networking ve Yatırımcı Buluşması Etkinliğin en değerli taraflarından biri, **tüm girişimlerin** etkinliği takip eden yatırımcılarla bir araya gelme fırsatı elde etmesiydi. Bu networking oportuniteleri: - Potansiyel yatırım fırsatları yaratıyor - Sektör deneyimli kişilerle bağlantı kurma imkanı sağlıyor - Gelecek iş birliklerinin temelini atıyor - Mentorluk ilişkilerinin başlangıcını oluşturuyor ![Demo Day Networking](/api/media/blog/genc-girisimciler-demo-day-2023/demo-day-sunum-4.jpg) ## İTÜ GİNOVA'yla Pratik Deneyim İTÜ öğrencileri, İTÜ GİNOVA'nın düzenlediği etkinliklerle teorik bilgiye ek olarak pratik deneyim kazanarak iş yaşamına daha donanımlı bir şekilde adım atıyor. ### Kapsamlı Girişimcilik Ekosistemi İTÜ GİNOVA sadece Demo Day ile sınırlı kalmayıp, kapsamlı bir girişimcilik ekosistemi sunuyor: - **"Find-Your-Co-Founder" Etkinlikleri**: Öğrencilere potansiyel ekip arkadaşları bulma fırsatı - **Jump Start Programları**: Sürekli eğitim ve gelişim - **Networking Events**: Sektör profesyonelleriyle buluşma - **Mentörlük Programları**: Deneyimli girişimcilerden rehberlik ## Geleceğe Yönelik Çağrı İTÜ GİNOVA, bütün İTÜ'lü öğrencilere gelecekteki etkinlikler için takipte kalmaları çağrısında bulunuyor. Bu tür etkinlikler: ### Öğrenci Girişimciliğini Güçlendiriyor - Teorik bilgiyi pratiğe dönüştürme - Gerçek iş dünyası deneyimi - Profesyonel network oluşturma ### Türkiye'nin İnovasyon Ekosistemini Besliyor - Genç yetenekleri keşfetme - Yenilikçi çözümler geliştirme - Teknoloji girişimciliğini destekleme İTÜ GİNOVA'nın bu köklü programı, Türkiye'nin girişimcilik ekosisteminde yeni nesil girişimcilerin yetişmesine katkı sağlamaya devam ediyor. Demo Day 2023, bu vizyonun başarıyla hayata geçirildiğinin en güzel örneklerinden biriydi.</p>	news	/api/media/blog/genc-girisimciler-demo-day-2023.jpg	İTÜ Medya ve İletişim Ofisi	2023-11-29 18:00:00	t	admin-user	admin-user	2023-11-29 18:00:00	2025-08-27 10:28:04.744	ginova-demo-day-2023-genc-girisimciler-fikirlerini-sahneye-tasidi	\N
17	İTÜ GİK'25 Zirvesi: Geleceğin Girişimcilerine Kapsamlı Rehberlik	İTÜ GİNOVA ve İTÜ Kariyer ve Staj Merkezi'nin düzenlediği İTÜ GİK'25 Zirvesi, girişimcilik ekosisteminin kritik konularını ele aldı.	İstanbul Teknik Üniversitesi Girişimcilik ve İnovasyon Uygulama ve Araştırma Merkezi (İTÜ GİNOVA) ve İTÜ Kariyer ve Staj Merkezi iş birliğiyle düzenlenen İTÜ GİK'25 – Girişimcilik, İnovasyon ve Kariyer Zirvesi, 18 Şubat 2025 tarihinde İTÜ Elektrik-Elektronik Fakültesi Ömer Korzay Konferans Salonunda başarıyla gerçekleştirildi.\n\n## Sektörün Önde Gelen İsimleriyle Paneller\n\nZirvede, girişimcilik ve iş dünyasının farklı alanlarına odaklanan panellerde sektörün önde gelen isimleri bilgi ve deneyimlerini katılımcılarla paylaştı. Dijital Dönüşüm, Growth Hacking, Kadın Girişimciliği, Yapay Zekâ ve Girişimcilik, Yatırımcı Perspektifi ve Yatırım Sermayesi gibi günümüz iş dünyasında kritik öneme sahip konular ele alındı.\n\n## Dijital Dönüşüm Oturumu\n\nZirvenin açılış oturumunda, Dijital Dönüşüm ve Sürdürülebilirlik Derneği (DDSDER) Başkanı **Kadir Ceran**, 1,618 Agency Başkanı **Sefa Karahan**, Marka ve Dijital Pazarlama Danışmanı ve Yazar **Bilal Temizer** ile Digital Brain Technologies Kurucu Ortağı ve CEO'su **Ayhan Demirci** dijital dönüşümün iş dünyasındaki etkilerini kapsamlı şekilde ele aldı.\n\n## Growth Hacking Stratejileri\n\nGrowth Hacking oturumunda, Growth Specialist ve Startup Mentor **Dr. Can Çoktuğ**, büyüme stratejileri üzerine kapsamlı bilgiler sunarak katılımcılara pratik yaklaşımlar aktardı.\n\n## Kadın Girişimciliği Paneli\n\nMarketing Strategist & AI Consultant **Gönül Damla Güven** moderatörlüğünde gerçekleşen Kadın Girişimciliği Paneli'nde:\n- Sektörel Dernekler Federasyonu (SEDEFED) Başkanı ve GEN Türkiye Başkan Yardımcısı **Emine Erdem**\n- Harem Chocolate Kurucusu **Belgin Karaağaç**\n- Mantı-Ye Kurucusu & Genel Müdürü **Eda Şişman**\n\nkadın girişimciliğinin dinamiklerini ve karşılaşılan zorlukları tartıştı.\n\n## Yapay Zeka ve Girişimcilik\n\nİTÜ Öğretim Üyesi, AITR Eşbaşkanı, Adin.Ai ve Parton Kurucu Ortağı **Prof. Dr. Altan Çakır** moderatörlüğünde gerçekleştirilen bu panelde:\n- AITR Türkiye Yapay Zekâ Platformu Eşbaşkanı **Levent Kızıltan**\n- İş Bankası Yapay Zekâ Fabrikası Girişim Tarama Yöneticisi **Yasemin Tavlaşoğlu**\n- AU INOVA & INOVA NeuroLab Direktörü, W.E.Q. Kurucu Ortağı **Doç. Dr. Dicle Yurdakul**\n\nyapay zekânın girişimcilik ekosistemi üzerindeki etkilerini değerlendirdi.\n\n## Yatırımcı Perspektifi ve Yatırım Sermayesi\n\nGünün son oturumunda, Yatırımcı Perspektifi & Yatırım Sermayesi Paneli kapsamında:\n- TR4 Kurucusu **Hakan Kesler**\n- StartupCentrum Kurucu Ortağı **Nizamettin Sami Harputlu**\n- Marketing Strategist & AI Consultant **Gönül Damla Güven**\n\nyatırım ekosisteminin dinamiklerini, girişimlerin fon bulma süreçlerini ve yatırımcı beklentilerini katılımcılarla paylaştı.\n\n## Yoğun İlgi ve Networking Fırsatı\n\nZirve, alanında uzman konuşmacıların değerli paylaşımlarıyla katılımcılardan yoğun ilgi gördü. Girişimcilik ekosistemine ilgi duyan öğrenciler ve profesyoneller için önemli bir öğrenme ve networking fırsatı sundu.\n\nİTÜ GİNOVA, etkinliğe katkı sağlayan tüm konuşmacılara, panelistlere ve katılımcılara teşekkür ederek bir sonraki zirvede tekrar bir araya gelme temennisinde bulundu.	Etkinlik	/api/media/events/itu-gik-25-2025.jpg	İTÜ Medya ve İletişim Ofisi	2025-02-19 17:00:00	t	admin-user	admin-user	2025-02-19 17:00:00	2025-02-19 17:00:00	itu-gik-25-zirvesi-gelecegin-girisimcilerine-rehberlik	\N
18	Jump Start Demo Günü: Girişimcilik Ruhunun Coşkulu Finali	İTÜ GİNOVA Jump Start programının 2025 Bahar dönemi Demo Day etkinliğinde genç girişimciler projelerini yatırımcılara sundular.	İstanbul Teknik Üniversitesi (İTÜ) Girişimcilik ve İnovasyon Merkezi (GİNOVA) tarafından her dönem düzenlenen Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı, 2025 Bahar dönemi eğitimlerini 14 Mayıs'ta gerçekleştirilen Demo Day etkinliğiyle coşkulu bir finale ulaştı.\n\n## Kapsamlı Eğitim Süreci\n\nJump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı, girişimcilik ekosistemine adım atmak isteyen tüm girişimci adaylarına hem teorik hem de pratik birçok fırsat sundu. Halkbank'ın da desteğiyle güçlenen program, girişimcilik alanında önemli bir adım olmayı sürdürdü.\n\n### 7 Haftalık Yoğun Süreç\n\nProgram, 19 Mart 2025 tarihinde başlayarak yedi hafta süren yoğun bir eğitim serisiyle gerçekleşti. Katılımcılar, aşağıdaki kritik konularda bilgi ve beceriler kazandılar:\n\n- **Tasarımsal Düşünce**: İnsan odaklı çözüm geliştirme\n- **İş Modeli Kurgulama**: Sürdürülebilir iş modelleri oluşturma\n- **Deney Tasarımı**: MVP geliştirme ve test etme\n- **Teknoloji Ticarileştirme ve Lisanslama Stratejileri**: IP yönetimi ve teknoloji transferi\n- **Girişimi Yatırıma Hazırlamak**: Yatırımcı sunumu ve pitch teknikleri\n\n## Mentörlük ve Rehberlik\n\nAlanında uzman eğitmenler ve profesyonellerin liderliğinde gerçekleştirilen oturumlar, girişimci adaylarına iş fikirlerini ticarileştirme ve pazarlama süreçlerini yönetme konusunda rehberlik etti.\n\nKatılımcılar ayrıca deney tasarımı atölyelerinde mentörlük desteği alarak projelerini geliştirdi. Eğitim süreci hem yüz yüze hem de asenkron modüllerle zenginleştirilerek toplamda **30 saatlik** kapsamlı bir deneyim sundu.\n\n## Program Sonrası Fırsatlar\n\nProgramın sonunda katılımcılar aşağıdaki değerli fırsatlara erişim sağladılar:\n- İleri aşama girişimcilik eğitimlerine katılma\n- Yatırımcılarla buluşma şansı\n- Birebir mentörlük alma fırsatı\n- İTÜ Çekirdek programlarına erişim\n\n## Demo Day: Girişimciler ve Yatırımcılar Buluşması\n\nGirişimciler ve yatırımcılar için bir buluşma noktası olan Demo Day 14 Mayıs 2025'te düzenlendi. Katılımcılar, eğitim sürecinde geliştirdikleri iş fikirlerini, sektörün önde gelen yatırımcı ve profesyonelleri karşısında sundular.\n\n### Dereceye Giren Takımlar\n\nJüri değerlendirmesi sonucu:\n- **🥇 Birinciliği**: PEKİ takımı\n- **🥈 İkinciliği**: Yasal Pusula takımı  \n- **🥉 Üçüncülüğü**: MyTale takımı\n\naldı. Etkinlik, yalnızca öğrenciler ve mentörler için değil, girişimcilik ekosistemine ilgi duyan herkes için ilham verici bir deneyim oldu.\n\n## Değerli Destekçiler\n\nDereceye giren takımlar aşağıdaki kurumların desteğiyle çeşitli ödüllerin sahibi oldu:\n- **Halkbank**: Ana sponsor desteği\n- **İTÜ Çekirdek**: Kuluçka programı fırsatları\n- **Strateji 360**: Danışmanlık hizmetleri\n- **LeanSoc**: Lean startup metodolojisi eğitimleri\n\n## Geleceğe Yönelik Hedefler\n\nİTÜ GİNOVA, Jump Start programıyla girişimcilik ruhunu desteklemeye ve geleceğin girişimcilerini yetiştirmeye devam ediyor. Program, Türkiye'nin teknoloji girişimcilik ekosisteminde önemli bir köprü görevini üstlenerek, genç yeteneklerin potansiyellerini gerçeğe dönüştürmelerine destek oluyor.	Etkinlik	/api/media/events/ginova-jump-start-demo-gunu-2025.jpg	İTÜ Medya ve İletişim Ofisi	2025-05-22 16:00:00	t	admin-user	admin-user	2025-05-22 16:00:00	2025-05-22 16:00:00	jump-start-demo-gunu-girisimcilik-ruhunun-finali-2025	\N
19	İTÜ GİNOVA Jump Start 2024: Güz Dönemi Girişimcilik Yolculuğu Başladı	İTÜ GİNOVA'nın geleneksel Jump Start programı 2024-2025 Güz dönemi ile girişimci adaylarını yeniden buluşturdu.	İTÜ Girişimcilik ve İnovasyon Merkezi (GİNOVA) tarafından geleneksel olarak her dönem düzenlenen ve tüm İTÜ mensuplarına açık olan "Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı", 2024-2025 Güz dönemi eğitimlerine 23 Ekim 2024'te başladı.\n\n## Güçlü Açılış\n\nProgramın açılışı, İTÜ GİNOVA Müdürü Doç. Dr. Adnan Veysel Ertemel'in "Girişimciliğe Giriş" dersiyle yapıldı. Bu ders, katılımcıları girişimcilik dünyasına adım atmaları için gereken temel bilgilerle donatmayı amaçladı.\n\n## Kapsamlı Eğitim Modülleri\n\nProgram kapsamında girişimci adayları, aşağıdaki kritik becerileri kazanacak:\n\n### Temel Girişimcilik Becerileri\n- **İş Fikirlerini Test Etme**: Deney tasarlama metodolojileri\n- **İş Modeli Oluşturma**: Sürdürülebilir iş modelleri geliştirme\n- **Yatırımcı Sunumlarına Hazırlık**: Pitch teknikleri ve sunum becerileri\n\n### İleri Düzey Konular\n- **Herkes için Design Thinking**: İnsan odaklı tasarım yaklaşımları\n- **Girişimciler için Teknoloji Ticarileştirme & Lisanslama Stratejileri**: IP yönetimi ve teknoloji transferi\n\n## MVP Geliştirme Atölyesi\n\n"Deney Tasarımı" atölyesi ile katılımcılar, iş fikirlerine uygun **Minimum Viable Product (MVP)** geliştirme becerisi kazanacak. Bu pratik yaklaşım, girişimci adaylarının fikirlerini hızla prototiplere dönüştürmelerine olanak sağlayacak.\n\n## Demo Day'e Hazırlık\n\nProgramın sonunda, katılımcılar projelerini yatırımcıların da yer aldığı bir jüriye sunacaklar. "Girişimi Yatırıma Hazırlamak" başlıklı kapsamlı atölye ile Demo Day sunumlarına etkili hazırlık yapacaklar.\n\n## Asenkron Eğitim Fırsatı\n\nKatılımcılar program kapsamında eğitim boyunca İTÜ GİNOVA Danışma Kurulu üyesi ve **MotivaCraft kurucusu Koray İnan'ın** katkılarıyla asenkron eğitim modüllerinden de yararlanabilecek. Bu hibrit yaklaşım, farklı zamanlarda çalışan öğrencilere esneklik sağlıyor.\n\n## Program Sonrası Fırsatlar\n\n30 saat süren eğitimi başarıyla tamamlayan öğrenciler aşağıdaki değerli fırsatlara erişim sağlayacak:\n\n### Eğitim ve Geliştirme\n- **1773 İTÜ Teknopark'ın ileri aşama girişimcilik eğitimlerine katılma**\n- **Sertifika ve mikro kredi tanımlanması**\n\n### Networking ve Yatırım\n- **Yatırımcılarla buluşma fırsatları**\n- **Uzman mentorlardan birebir danışmanlık alma**\n\n## Süreklilik ve Gelecek\n\nJump Start girişimcilik programı, devam modülleriyle önümüzdeki haftalarda katılımcılarla buluşmaya devam edecek. Bu süreklilik, öğrenilen bilgilerin pratiğe dökülmesi ve projlerin geliştirilmesi açısından kritik önem taşıyor.\n\nİTÜ GİNOVA'nın bu köklü programı, Türkiye'nin girişimcilik ekosisteminde yeni nesil girişimcilerin yetişmesine katkı sağlamaya devam ediyor.	Etkinlik	/api/media/events/ginova-jump-start-2024.jpg	İTÜ Medya ve İletişim Ofisi	2024-11-01 17:00:00	t	admin-user	admin-user	2024-11-01 17:00:00	2024-11-01 17:00:00	ginova-jump-start-2024-guz-donemi-basladi	\N
20	Fikri Sınai Haklar Etkinliği: Girişimciler İçin Patent Rehberi	İTÜ GİNOVA ve İTÜ Projeler Ofisi'nin düzenlediği etkinlikte girişimciler patent süreçleri ve ticarileştirme stratejileri hakkında bilgilendi.	İstanbul Teknik Üniversitesi'nin girişimcilik ve inovasyon merkezi İTÜ GİNOVA, öğrencilere önemli bir eğitim fırsatı sunarak girişimcilik alanına katkı sağlamaya devam ediyor. İTÜ Projeler Ofisi işbirliğiyle gerçekleştirilen ve girişimciler için kritik unsurlardan birini odağına alan "Fikri Sınai Haklar Genel Yönetim Süreci ve Ticarileştirme Stratejileri Etkinliği", öğrencilere yol gösterici bir farkındalık yaratırken, girişimciliğin ne denli önemli olduğunu bir kez daha vurguladı.\n\n## Uzman Konuşmacılar\n\nEtkinlikte, İTÜ Projeler Ofisi'nin deneyimli uzmanları katılımcılarla buluştu:\n\n### İlay Öziş - Fikri Sınai Haklar Müdürlüğü Kıdemli Uzmanı\nİTÜ Projeler Ofisi Fikri Sınai Haklar Müdürlüğü (FSMH) Kıdemli Uzmanı İlay Öziş, girişimcilerin fikirlerini patentleme noktasında dikkate alması gereken önemli konuları katılımcılara aktardı.\n\n### Cihat Çetin - Ticarileştirme Müdürlüğü Müdür Yardımcısı\nTicarileştirme Müdürlüğü Müdür Yardımcısı Cihat Çetin de girişimcilik yolculuğunda izlenecek adımlar ve ticarileştirme stratejileri konularında detaylı bir sunum gerçekleştirdi.\n\n## Kapsamlı Program İçeriği\n\n### Temel Konular\n- **Girişimcilik Yolculuğunda İzlenecek Adımlar**: Fikirden ürüne geçiş süreçleri\n- **Fikri Sınai Haklar**: Patent, marka, tasarım tescili süreçleri\n- **Ticarileştirme Stratejileri**: Teknoloji transferi ve piyasaya çıkış\n\n### Patent Süreçleri\nGirişimcilerin fikirlerini koruma altına almak için gerekli yasal süreçler ve prosedürler detaylandırıldı. Bu bilgiler, yenilikçi fikirlerin güvenli bir şekilde geliştirilmesi için kritik öneme sahip.\n\n## Gerçek Başarı Hikayeleri\n\nProgram kapsamında öğrenciler **Melih Biçer** ve **Pelin Kaya**, üye oldukları öğrenci takımı aracılığıyla geliştirdikleri bir patentin ticarileştirme sürecini paylaştılar.\n\n### İTÜ Projeler Ofisi - Windustry İşbirliği\nBu başarı hikayesi, İTÜ Projeler Ofisi ve Windustry şirketi işbirliğiyle gerçekleştirilen ticarileştirme sürecini içeriyor. Öğrenciler:\n- Patent geliştirme sürecini\n- Ticarileştirme aşamalarını\n- Sektör ortaklıklarının önemini\n- Başarılı sonuçları\n\ndetaylarıyla aktardılar.\n\n## Girişimcilik Ekosistemi İçinde Önemli Adım\n\nBu etkinlik, İTÜ'nün girişimcilik ekosistemindeki konumunu güçlendiren önemli bir adım oldu. Öğrencilere sunulan bu fırsat:\n\n### Teorik ve Pratik Birlikteliği\n- Uzman bilgilerinin aktarılması\n- Gerçek örneklerle desteklenen eğitim\n- İnteraktif soru-cevap oturumları\n\n### Farkındalık Yaratma\nEtkinlik, girişimcilik yolculuğunda fikri mülkiyet haklarının ne denli kritik olduğu konusunda kapsamlı bir farkındalık yarattı.\n\n## Gelecek Perspektifi\n\nİTÜ GİNOVA ve İTÜ Projeler Ofisi işbirliği, öğrencilerin girişimcilik potansiyellerini geliştirmek için devam edecek. Bu tür etkinlikler:\n- Öğrenci girişimciliğini teşvik ediyor\n- Akademi-sanayi işbirliğini güçlendiriyor\n- Yenilikçi projelerin ticarileştirilmesine destek oluyor\n\nTürkiye'nin teknoloji girişimcilik ekosisteminde önemli bir rol üstlenen İTÜ, bu etkinliklerle geleceğin girişimcilerini yetiştirmeye devam ediyor.	Etkinlik	/api/media/events/fikri-sinai-haklar-2024.jpg	İTÜ Medya ve İletişim Ofisi	2024-01-03 18:00:00	t	admin-user	admin-user	2024-01-03 18:00:00	2024-01-03 18:00:00	fikri-sinai-haklar-etkinligi-patent-rehberi-2024	\N
21	Jump Start 2024: Bahar Dönemi Girişimcilik Yolculuğu Başladı	İTÜ GİNOVA'nın Jump Start programının 2024 bahar yarıyılı eğitimleri Mart ayında başladı.	İstanbul Teknik Üniversitesi (İTÜ) Girişimcilik ve İnovasyon Merkezi (GİNOVA) tarafından her dönem, bütün İTÜ'lülerin katılımına açık olarak düzenlenen "Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı"nın 2023-2024 bahar yarıyılı eğitimi, 13 Mart 2024 tarihinde ilk modülüyle gerçekleştirildi.\n\n## Güçlü Açılış\n\nEğitimin ilk modülünde iki değerli konuşmacı katılımcılarla buluştu:\n\n### Doç. Dr. Adnan Veysel Ertemel - İTÜ GİNOVA Müdürü\nİTÜ GİNOVA Müdürü Doç. Dr. Adnan Veysel Ertemel, girişimcilik ekosistemi ve programın hedefleri hakkında kapsamlı bir sunum gerçekleştirdi.\n\n### Buğra Tosun - Başarılı Girişimci Mezun\nGeçmiş Jump Start eğitimlerini tamamlayıp kendi girişimini kurmuş olan öğrenci Buğra Tosun, girişimcilik deneyimlerini ve başarı hikayesini paylaştı. Bu gerçek örnek, katılımcılara programın potansiyelini somut olarak gösterdi.\n\n## Kapsamlı Eğitim İçeriği\n\nProgram, girişimci adaylarına kritik becerileri kazandırmayı hedefliyor:\n\n### İş Fikri Geliştirme\n- **Nitelikli Deney Tasarlama**: İş fikirlerini teyit etmek için sistematik yaklaşımlar\n- **Tasarımsal Düşünce Bakış Açısı**: İnsan odaklı çözüm geliştirme metodolojileri\n- **İş Modeli Tasarımı**: Sürdürülebilir ve ölçeklenebilir iş modelleri oluşturma\n\n### Yatırımcı Hazırlığı\n- **Sunum Teknikleri**: Etkili pitch hazırlama ve sunma becerileri\n- **Yatırımcı Perspektifi**: Yatırımcıların aradığı özellikler ve beklentiler\n\n## Gerçek Yatırımcı Deneyimi\n\nEğitim sonunda katılımcılar, gerçek yatırımcıların da olduğu bir jüriye sunum yapma şansı buldular. Bu uygulama:\n- Gerçek pitch deneyimi sağlıyor\n- Profesyonel geri bildirim alma fırsatı veriyor\n- Networking olanakları yaratıyor\n\n## Program Sonrası Değerli Fırsatlar\n\n30 saat süren eğitimi tamamlayanlar aşağıdaki benzersiz fırsatlara erişim sağlıyor:\n\n### 1773 İTÜ Teknopark İleri Eğitimleri\n- İleri aşama girişimcilik eğitimlerine katılma hakkı\n- Teknopark ekosisteminden yararlanma\n\n### Yatırımcı Ağı\n- Yatırımcılarla bir araya gelme imkanı\n- Potansiyel yatırım fırsatlarına erişim\n\n### Uzman Mentörlük\n- Alanlarında uzman mentorlardan birebir danışmanlık alma\n- Kişiselleştirilmiş rehberlik hizmeti\n\n### Mikro Kredi Uygulaması\nProgram ayrıca mikro kredi uygulaması kapsamında yer alıyor, bu da katılımcılara finansal destek sağlıyor.\n\n## Süreklilik ve Gelecek\n\nJump Start Girişimcilik Eğitimleri, devam modülleriyle ilerleyen haftalarda katılımcılarla buluşmaya devam edecek. Bu sürekli yaklaşım:\n- Öğrenilen bilgilerin pekiştirilmesini sağlıyor\n- Adım adım ilerleme imkanı veriyor\n- Topluluk oluşumunu destekliyor\n\n## İTÜ Girişimcilik Ekosistemi\n\nBu program, İTÜ'nün girişimcilik ekosistemindeki merkezi rolünü pekiştiriyor. Üniversitenin:\n- Akademik mükemmelliği\n- Endüstri bağlantıları\n- İnovasyon kültürü\n\nöğrencilere benzersiz bir girişimcilik deneyimi sunuyor.\n\n## Erişilebilir Eğitim\n\nProgramın bütün İTÜ'lülerin katılımına açık olması, demokratik bir girişimcilik eğitimi anlayışını yansıtıyor. Bu yaklaşım:\n- Fırsat eşitliği yaratıyor\n- Çeşitli disiplinlerden öğrencileri bir araya getiriyor\n- Interdisipliner işbirlikleri doğuruyor\n\nİTÜ GİNOVA'nın bu köklü programı, Türkiye'nin girişimcilik ekosisteminde yeni nesil girişimcilerin yetişmesine katkı sağlamaya devam ediyor.	Etkinlik	/api/media/events/jump-start-egitim-2024.jpg	İTÜ Medya ve İletişim Ofisi	2024-03-15 18:00:00	t	admin-user	admin-user	2024-03-15 18:00:00	2024-03-15 18:00:00	jump-start-2024-bahar-donemi-girisimcilik-yolculugu	\N
24	İTÜ GİNOVA Jump Start Programı Başarıyla Tamamlandı	İTÜ GİNOVA Jump Start Girişimciliğe Hızlı Başlangıç Programı, 4 haftalık eğitim sürecini tamamlayarak 17 Nisan 2024'te Demo Day ile sona erdi. Öğrenciler aldıkları eğitimlerle projelerini yatırımcılar önünde sergiledi.	# İTÜ GİNOVA Jump Start Programı Başarıyla Tamamlandı\n\nİTÜ GİNOVA tarafından düzenlenen **Jump Start Girişimciliğe Hızlı Başlangıç Programı**, 4 haftalık eğitim sürecini başarıyla tamamladı. Program, **17 Nisan 2024** tarihinde gerçekleştirilen "**Jump Start Demo Day**" ile sona erdi.\n\n![İTÜ GİNOVA Jump Start Program Afişi](/api/media/blog/jump-start-4-hafta-ana.jpg)\n\n## Program Süreci\n\n**İstanbul Teknik Üniversitesi, Girişimcilik ve İnovasyon Merkezi (İTÜ GİNOVA)** tarafından her dönem tüm İTÜ öğrencilerinin katılımına açık olarak düzenlenen "**Jump Start Girişimciliğe Hızlı Başlangıç Programı**", 2023-2024 Bahar Yarıyılında gerçekleştirdiği eğitim sürecini tamamladı.\n\n### Eğitim Programı İçeriği\n\nÖnceki haftalarda, öğrenciler aşağıdaki konularda kapsamlı eğitimler aldı:\n\n![Jump Start Eğitim Oturumu](/api/media/blog/jump-start-egitim-4.jpg)\n\n- **Doç. Dr. Adnan Veysel Ertemel'den**: "Girişimciliğe Giriş" ve "Deney Tasarımı"\n- **Engin Özen'den**: "Design Thinking"\n- **Cihan Çetin'den**: "Teknoloji Ticarileştirme & Lisanslama Stratejileri"\n- **Dr. Can Çoktuğ'dan**: "Girişimi Yatırıma Hazırlamak" (Unitic Growth kurucusu)\n\n![Öğrenci Katılımı](/api/media/blog/jump-start-ogrenci-2.jpg)\n\nSon hafta olan **3 Nisan 2024** günü, **Unitic Growth** kurucusu **Dr. Can Çoktuğ'un** "**Girişimi Yatırıma Hazırlamak**" konulu dersiyle dört haftalık eğitimin son bölümü tamamlandı.\n\n## Demo Day Etkinliği\n\n![Proje Sunumları](/api/media/blog/jump-start-sunum-1.jpg)\n\nİTÜ GİNOVA Jump Start Girişimcilik Eğitimleri, **17 Nisan 2024**'te gerçekleşen **Jump Start Demo Day** ile son buldu. Katılımcılar, Jump Start süresince aldıkları eğitimlerden yararlanarak geliştirdikleri projeleri ve fikirleri, Demo Day'de **yatırımcılar önünde sergiledi**.\n\n![Demo Day Hazırlığı](/api/media/blog/jump-start-demo-hazirlik.jpg)\n\n### Katılımcı Kazanımları\n\nProgramı tamamlayan öğrenciler önemli fırsatlara erişim sağladı:\n\n![Öğrenci Başarısı](/api/media/blog/jump-start-ogrenci-1.jpg)\n\n- **1773 İTÜ Teknopark**'ın ileri aşama girişimcilik eğitimlerine katılma hakkı\n- **Yatırımcılarla buluşma** imkânı\n- Alanlarında uzman **mentorlardan birebir danışmanlık** alma fırsatı\n- **Mikro kredi uygulaması** kapsamında yer alma\n\n![Proje Geliştirme Süreci](/api/media/blog/jump-start-sunum-2.jpg)\n\n## Program Özellikleri\n\n### Eğitim Detayları\n\n- **Süre**: 4 hafta\n- **Toplam Eğitim Saati**: 30 saat\n- **Katılımcı**: Tüm İTÜ öğrencilerine açık\n- **Dönem**: 2023-2024 Bahar Yarıyılı\n- **Sonuç**: Demo Day ile proje sunumları\n\n### Programın Hedefleri\n\nBu kapsamlı program ile öğrenciler:\n\n1. **Girişimcilik Temellerini** öğrendi\n2. **Design Thinking** metodolojisini kavradı\n3. **Teknoloji Ticarileştirme** süreçlerini anladı\n4. **Yatırımcı Hazırlığı** konusunda bilgi sahibi oldu\n5. **Proje Geliştirme** deneyimi kazandı\n\n## İTÜ GİNOVA'nın Misyonu\n\nİTÜ GİNOVA, bu tür programlarla **İTÜ öğrencilerinin girişimcilik potansiyelini** ortaya çıkarmaya ve **inovasyon ekosistemini** güçlendirmeye devam ediyor. \n\nJump Start programı, **teorik bilgi** ile **pratik uygulamayı** birleştirerek öğrencilerin **gerçek girişimcilik deneyimi** yaşamasını sağlıyor.\n\n## Gelecek Adımlar\n\nProgramı başarıyla tamamlayan öğrenciler artık:\n\n- **İleri seviye girişimcilik programlarına** katılabilir\n- **Teknopark ekosisteminden** faydalanabilir\n- **Mentor ağına** erişim sağlayabilir\n- **Yatırımcı buluşmalarına** katılabilir\n\nİTÜ GİNOVA, girişimcilik ekosistemine katkı sağlamaya ve **yenilikçi projeleri** desteklemeye devam edecek.	News	/api/media/blog/jump-start-4-hafta-ana.jpg	İTÜ GİNOVA	2024-04-05 00:00:00	t	\N	\N	2024-04-05 00:00:00	2025-08-27 10:33:09.872155	itu-ginova-jump-start-programi-tamamlandi-2024	/api/media/blog/jump-start-egitim-4.jpg, /api/media/blog/jump-start-sunum-1.jpg, /api/media/blog/jump-start-ogrenci-2.jpg, /api/media/blog/jump-start-demo-hazirlik.jpg, /api/media/blog/jump-start-ogrenci-1.jpg, /api/media/blog/jump-start-sunum-2.jpg
23	Girişimciliğe Açılan Kapı: İTÜ GİNOVA Jump Start Demo Day 2024	İTÜ GİNOVA Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı, 2024 güz dönemi eğitimlerini başarılı bir Demo Day etkinliğiyle tamamladı. MotoCTRL projesi birinciliği kazanırken, Cybele ve Fastzayn projeleri ikinciliği paylaştı.	# Girişimciliğe Açılan Kapı: İTÜ GİNOVA Jump Start Demo Day 2024\n\nİTÜ Girişimcilik ve İnovasyon Merkezi (GİNOVA) tarafından her dönem düzenlenen ve tüm İTÜ mensuplarına açık olan Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı, 2024 güz dönemi eğitimlerini 4 Aralık'ta gerçekleştirilen Demo Day etkinliğiyle tamamladı. Program, girişimcilik ekosistemine adım atmak isteyen gençler için hem teorik hem de pratik birçok fırsat sundu.\n\n## Kapsamlı Eğitim Süreci\n\n23 Ekim 2024 tarihinde, İTÜ GİNOVA Müdürü Doç. Dr. Adnan Veysel Ertemel'in verdiği "Girişimciliğe Giriş" dersiyle başlayan program, altı hafta boyunca süren yoğun bir eğitim serisiyle devam etti. Eğitim sürecinde katılımcılar şu konularda bilgi ve beceriler kazandılar:\n\n- **Tasarımsal Düşünce**: İnsan odaklı çözüm geliştirme yaklaşımları\n- **İş Modeli Kurgulama**: Sürdürülebilir iş modellerinin oluşturulması\n- **Deney Tasarımı**: Hipotez testleri ve MVP geliştirme\n- **Teknoloji Ticarileştirme**: Ar-Ge sonuçlarının piyasaya aktarılması\n- **Lisanslama Stratejileri**: Fikri mülkiyet haklarının yönetimi\n- **Girişimi Yatırıma Hazırlamak**: Yatırımcı sunumları ve pitch teknikleri\n\nAlanında uzman eğitmenler ve profesyonellerin liderliğinde gerçekleştirilen bu oturumlar, girişimci adaylarına iş fikirlerini ticarileştirme ve pazarlama süreçlerini yönetme konularında rehberlik etti.\n\n## Mentorluk ve Pratik Deneyim\n\nKatılımcılar, deney tasarımı atölyelerinde mentorluk desteği alarak projelerini geliştirdi. Eğitim süreci hem yüz yüze hem de asenkron modüllerle zenginleştirilerek toplamda 30 saatlik kapsamlı bir deneyim sundu. Programın sonunda katılımcılar:\n\n- İleri aşama girişimcilik eğitimlerine katılma fırsatı\n- Yatırımcılarla buluşma imkanı\n- Birebir mentorluk alma şansı\n\nyakaladılar.\n\n## Demo Day Heyecanı\n\n4 Aralık 2024'te düzenlenen Demo Day, girişimciler ve yatırımcılar için bir buluşma noktası oldu. Etkinlik, İTÜ Rektörü Prof. Dr. Hasan Mandal'ın açılış konuşmasıyla başladı.\n\n![Demo Day Açılış](/api/media/blog/ginova-demo-day-2024-aralik.jpg)\n\nRektörümüz Prof. Dr. Hasan Mandal, girişimcilik eğitiminin önemli boyutlarına değinerek:\n\n> "Girişimcilik yalnızca ekonomik kazanç değil, topluma katkı sağlama ve sürdürülebilir değer üretme amacını taşımalıdır. Bu süreç üniversite sonrası başlayan değil, üniversite yıllarından itibaren şekillenen ve sürekli gelişen bir yolculuktur."\n\nşeklinde konuştu.\n\n## Proje Sunumları ve Kazananlar\n\nDemo Day kapsamında katılımcılar, eğitim sürecinde geliştirdikleri projeleri sektörün önde gelen yatırımcılarından oluşan jüri karşısında sundular.\n\n![Proje Sunumları](/api/media/blog/ginova-demo-day-2024-sunum-1.jpg)\n\n![Katılımcı Sunumları](/api/media/blog/ginova-demo-day-2024-sunum-2.jpg)\n\nDemo Day sonunda, jüri değerlendirmesi sonucu:\n\n🥇 **Birinci**: MotoCTRL projesi\n🥈 **İkinci**: Cybele ve Fastzayn projeleri (ortak)\n\n![Kazanan Projeler](/api/media/blog/ginova-demo-day-2024-kazanan.jpg)\n\n## Girişimcilik Ekosisteminin Geleceği\n\nEtkinlik, sadece öğrenciler ve mentorlar için değil, girişimcilik ekosistemine ilgi duyan herkes için ilham verici bir deneyim oldu. İTÜ GİNOVA, Jump Start programıyla:\n\n- Girişimcilik ruhunu desteklemeye\n- Geleceğin girişimcilerini yetiştirmeye\n- İnovatif projeleri hayata geçirmeye\n\ndevam ediyor.\n\nBu programın başarısı, İTÜ'nin girişimcilik ekosistemindeki öncü rolünü bir kez daha kanıtlarken, katılımcıların aldığı eğitim ve deneyimler sayesinde Türkiye'nin teknoloji ve inovasyon geleceğine önemli katkılar sağlanacağına işaret ediyor.	News	/api/media/blog/ginova-demo-day-2024-aralik.jpg	İTÜ Medya ve İletişim Ofisi	2024-12-06 00:00:00	t	\N	\N	2024-12-06 00:00:00	2025-08-27 10:08:35.76827	itu-ginova-jump-start-demo-day-2024	\N
10	İTÜ GİNOVA ve Taptoweb İşbirliğiyle Dijital Dönüşüm Etkinliği Başarıyla Tamamlandı	İTÜ GİNOVA ve Taptoweb işbirliğiyle düzenlenen 3 haftalık dijital dönüşüm etkinliği, öğrencilere kod bilgisi olmadan uygulama geliştirme imkanı sundu.	# İTÜ GİNOVA ve Taptoweb İşbirliğiyle Dijital Dönüşüm\n\nİTÜ GİNOVA tarafından **2-23 Aralık 2023** tarihlerinde düzenlenen "**Kodlama ve Teknik Bilgiye İhtiyaç Duymadan Dijital Dönüşüm**" etkinliği başarıyla tamamlandı. Girişimci adayı öğrenciler, kod ve teknik bilgi gerektirmeden uygulama geliştirerek işlerini inovatif bir şekilde dijitale dökme fırsatı yakaladı.\n\n![İTÜ GİNOVA ve Taptoweb İşbirliği](/api/media/blog/dijital-donusum-ana-gorsel.jpg)\n\n## Etkinlik Detayları\n\nİTÜ GİNOVA ve **Taptoweb** işbirliğiyle gerçekleştirilen bu özel etkinlik, öğrencileri yenilikçi bir platformla tanıştırdı. Öğrencilere kod ve teknik bilgi gerektirmeden, dijital iş süreçlerini yönetme becerisi kazandırmayı hedefleyen etkinlik **Taptoweb**'in uygulaması **Easyapp** üzerinden gerçekleştirildi.\n\n### Eğitim Süreci\n\n- **Süre**: 3 hafta (2-23 Aralık 2023)\n- **Platform**: Easyapp uygulaması\n- **Lokasyon**: İTÜ Teknokent\n- **Katılımcı Seçimi**: Yoğun başvurular arasından seçilen öğrenciler\n\n![Dijital Dönüşüm Eğitimi](/api/media/blog/dijital-donusum-egitim-1.jpg)\n\nKatılımcılardan gelen yoğun başvurular arasından seçilen öğrencilere, Easyapp uygulamasını etkili bir şekilde kullanabilmeleri için özel eğitimler verildi. Bu eğitimler, dijital dönüşümü kolaylaştıran pratik bilgilerle donanmış olan öğrencilere kendi projelerini geliştirme olanağı sundu.\n\n![Öğrenci Eğitim Oturumları](/api/media/blog/dijital-donusum-egitim-2.jpg)\n\n### Mentor Desteği ve Değerlendirme\n\nMentor desteğiyle sürekli olarak desteklenen katılımcılar, 3 haftanın sonunda ortaya koydukları uygulamalar arasından en başarılı olanları belirlemek üzere bir değerlendirme sürecine girdiler. Bu sürecin ardından **dereceye giren ilk 3 takım özel ödüller kazandı**.\n\n![Proje Geliştirme Süreci](/api/media/blog/dijital-donusum-egitim-3.jpg)\n\n## İTÜ'nin Dijital Dönüşüm Vizyonu\n\n**İstanbul Teknik Üniversitesi**'nin dijital dönüşüm seferberliği kapsamında önemli bir adım olan bu etkinlik, teknik üniversite öğrencilerine dijital dönüşüm süreçlerinin içinde yer alma imkânı sundu.\n\n![Katılımcıların Başarısı](/api/media/blog/dijital-donusum-katilimci.jpeg)\n\nEtkinlik kapsamında öğrencilerin teknoloji ve girişimcilik alanındaki yeteneklerini geliştirmesine olanak sağlandı. Bu tür işbirlikleri, İTÜ GİNOVA'nın girişimcilik ekosistemindeki rolünü güçlendirmeye devam ediyor.\n\n## No-Code Devrimin Etkisi\n\nBu başarılı etkinlik, **no-code** ve **low-code** çözümlerin geleceğin dijital dönüşümündeki önemini ortaya koydu. Öğrenciler, teknik detaylara takılmadan fikirlerini hayata geçirme becerisi kazandılar.\n\n### Katılımcı Kazanımları\n\n- **Hızlı Prototipleme**: Fikirden uygulamaya kısa sürede geçiş\n- **Dijital Beceriler**: No-code araçları kullanma yetkinliği\n- **Girişimcilik Deneyimi**: İş fikri geliştirme ve sunum becerileri\n- **Networking**: Mentorlar ve diğer katılımcılarla bağlantı kurma\n\n## Gelecek Hedefleri\n\nİTÜ GİNOVA, bu tür inovatif etkinliklerle girişimcilik ekosistemine katkı sağlamaya devam edecek. Teknoloji ve girişimcilik alanında öğrencilere sunulan fırsatlar, İTÜ'nün inovasyon misyonunun önemli bir parçasını oluşturuyor.	Etkinlik	/api/media/blog/dijital-donusum-ana-gorsel.jpg	İTÜ GİNOVA	2023-12-27 00:00:00	t	\N	admin-user	2023-12-27 00:00:00	2025-08-27 10:19:10.301	dijital-donusum-etkinligi-2023	/api/media/blog/dijital-donusum-egitim-1.jpg, /api/media/blog/dijital-donusum-egitim-2.jpg, /api/media/blog/dijital-donusum-egitim-3.jpg, /api/media/blog/dijital-donusum-katilimci.jpeg
\.


--
-- Data for Name: event_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.event_applications (id, event_id, event_title, first_name, last_name, email, phone, organization, "position", experience, motivation, dietary_requirements, additional_notes, status, review_notes, reviewed_by, reviewed_at, created_at, updated_at) FROM stdin;
1	9	Sürdürülebilirlik ve İnovasyon Forumu	Can	Çoktuğ	cancoktug@gmail.com	05327063317	Unitic	test	test	test ile devam edelim test test test test ile devam edelim test test test			Beklemede	\N	\N	\N	2025-08-27 20:36:16.166292	2025-08-27 20:36:16.166292
2	9	Sürdürülebilirlik ve İnovasyon Forumu	Unitic	Sirketi	uniticmarketing@gmail.com	0532000000	Unitic	test	test	testtest nslknlasfndlaksnflkandlkasndlsandlasndlasnd	test	test	Beklemede	\N	\N	\N	2025-08-28 16:26:12.76707	2025-08-28 16:26:12.76707
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.events (id, title, description, date, "time", location, image, is_online, registration_url, is_active, created_by, updated_by, created_at, updated_at, slug, gallery, status) FROM stdin;
1	Girişimcilik Zirvesi 2025	Türkiye'nin en büyük girişimcilik etkinliği! Başarılı girişimciler, yatırımcılar ve sektör uzmanları ile buluşma fırsatı.	2025-03-15 09:00:00	09:00	İTÜ Ayazağa Kampüsü	/api/media/events/summit-2025.svg	f	https://forms.gle/summit2025	t	41781800	\N	2025-07-07 20:54:20.389258	2025-07-07 20:54:20.389258	girisimcilik-zirvesi-2025	\N	upcoming
2	AI ve İnovasyon Workshop'u	Yapay zeka teknolojilerinin girişimcilik dünyasındaki rolünü keşfedin. Hands-on uygulamalar ile AI araçlarını kullanmayı öğrenin.	2025-02-20 14:00:00	14:00	İTÜ Arı 3 Teknokent	/api/media/events/ai-workshop.svg	f	https://forms.gle/aiworkshop	t	41781800	\N	2025-07-07 20:54:20.389258	2025-07-07 20:54:20.389258	ai-ve-inovasyon-workshop	\N	upcoming
3	Startup Pitch Gecesi	Yeni başlayan startup'ların projelerini sunacağı heyecan verici gece! Yatırımcılar karşısında sunumlar yapın.	2025-02-28 19:00:00	19:00	İTÜ Süleyman Demirel Kültür Merkezi	/api/media/events/pitch-night.svg	f	https://forms.gle/pitchnight	t	41781800	\N	2025-07-07 20:54:20.389258	2025-07-07 20:54:20.389258	startup-pitch-gecesi	\N	upcoming
4	Blockchain ve Web3 Semineri	Blockchain teknolojisi ve Web3 dünyasına giriş semineri. Kripto para, NFT, DeFi konularında bilgi edinin.	2025-03-05 10:00:00	10:00	Online Zoom	/api/media/events/blockchain-seminar.svg	t	https://zoom.us/j/blockchain	t	41781800	\N	2025-07-07 20:54:20.389258	2025-07-07 20:54:20.389258	blockchain-ve-web3-semineri	\N	upcoming
5	Kadın Girişimciler Paneli	Başarılı kadın girişimcilerden ilham alın! Kariyerlerindeki zorlukları ve başarı hikayelerini dinleyin.	2025-03-08 15:00:00	15:00	İTÜ Rektörlük Binası	/api/media/events/women-entrepreneurs.svg	f	https://forms.gle/womenentrepreneurs	t	41781800	\N	2025-07-07 20:54:20.389258	2025-07-07 20:54:20.389258	kadin-girisimciler-paneli	\N	upcoming
10	Kodlama ve Teknik Bilgiye İhtiyaç Duymadan Dijital Dönüşüm	İTÜ GİNOVA ve Taptoweb işbirliğiyle 2-23 Aralık 2023 tarihleri arasında düzenlenen bu 3 haftalık etkinlikte, girişimci adayı öğrenciler kod ve teknik bilgi gerektirmeden uygulama geliştirerek işlerini inovatif bir şekilde dijitale dökme fırsatı yakaladı. \n\nÖğrencilere Easyapp uygulaması üzerinden dijital dönüşüm süreçlerini öğrenme imkanı sunuldu. Mentor desteğiyle sürekli desteklenen katılımcılar, 3 haftanın sonunda ortaya koydukları uygulamalar arasından en başarılı olanları belirlemek üzere değerlendirme sürecine girdi.\n\nEtkinlik sonunda dereceye giren ilk 3 takım özel ödüller kazandı. Bu etkinlik İTÜ nin dijital dönüşüm seferberliği kapsamında önemli bir adım olarak gerçekleştirildi.	2023-12-23 18:00:00	2-23 Aralık 2023	İTÜ Teknokent	/api/media/events/digital-transformation-workshop.png	f	\N	t	\N	\N	2025-08-26 19:45:43.357788	2025-08-26 19:45:43.357788	dijital-donusum-workshop-2023	/api/media/events/gallery/dijital-donusum-workshop/ginova-tw-t.jpg,/api/media/events/gallery/dijital-donusum-workshop/tabtoweb-1.jpg,/api/media/events/gallery/dijital-donusum-workshop/tabtoweb-2.jpg,/api/media/events/gallery/dijital-donusum-workshop/tabtoweb-3.jpg,/api/media/events/gallery/dijital-donusum-workshop/tabtoweb-5.jpg	upcoming
11	Find Your Co-Founder Etkinliği	İş fikirlerine proje ortağı bulmak isteyen öğrencilerin bir araya geldiği networking etkinliği. 17 Mayıs 2023'te gerçekleştirilen bu etkinlikte İTÜ Yazılım Kulübü'nden öğrencilerin yanı sıra, endüstriyel tasarım ve farklı mühendislik bölümlerinden öğrenciler katılım gösterdi. Katılımcılar birbirleriyle tanışarak inovatif proje fikirlerini paylaştılar ve diğer disiplinlerden ihtiyaç duydukları ortaklarla buluştular.	2023-05-17 14:00:00	14:00	İTÜ Ayazağa Kampüsü	/api/media/events/find-your-co-founder.jpg	f	\N	t	\N	\N	2025-08-26 20:07:47.026322	2025-08-26 20:07:47.026322	find-your-co-founder-etkinligi	/api/media/events/gallery/find-your-co-founder/foto1.jpg,/api/media/events/gallery/find-your-co-founder/foto2.jpg,/api/media/events/gallery/find-your-co-founder/foto3.jpg,/api/media/events/gallery/find-your-co-founder/foto4.jpg	upcoming
12	Yapay Zeka ve Yeni Nesil Girişimcilik Semineri	İTÜ GİNOVA tarafından düzenlenen Town Hall Seminerleri bünyesinde, İş Bankası Yapay Zeka Fabrikası koordinatörü Kadir Bulut ile yapay zekanın girişimcilik ekosistemindeki rolü ve fırsatları üzerine interaktif bir seminer. 14 Şubat 2024 tarihinde İTÜ Ayazağa Yerleşkesi MED A-A15te gerçekleştirilen bu etkinlikte, yeni nesil girişimcilik kavramı odağında yapay zeka teknolojilerinin nasıl daha etkin kullanılabileceği konuşuldu. Öğrenciler girişim fikirlerini paylaştıkları interaktif bir ortama da katıldılar.	2024-02-14 14:00:00	14:00	İTÜ Ayazağa Yerleşkesi MED A-A15	/api/media/events/yapay-zeka-girisimcilik-semineri.jpg	f	\N	t	admin-user	admin-user	2025-08-26 20:36:46.11986	2025-08-26 20:36:46.11986	yapay-zeka-yeni-nesil-girisimcilik-semineri	/api/media/events/gallery/yapay-zeka-girisimcilik-semineri/seminer-kapak.jpg,/api/media/events/gallery/yapay-zeka-girisimcilik-semineri/town-hall-foto1.jpeg,/api/media/events/gallery/yapay-zeka-girisimcilik-semineri/town-hall-foto2.jpeg,/api/media/events/gallery/yapay-zeka-girisimcilik-semineri/town-hall-foto3.jpg	upcoming
13	Find Your Co-Founder Etkinliği 2024	İTÜ GİNOVA tarafından düzenlenen "Find Your Co-Founder" Etkinliği, yazılımdan endüstriyel tasarıma kadar birçok farklı disiplinden öğrenciyi bir araya getirdi. 28 Şubat 2024 tarihinde İTÜ Ayazağa Yerleşkesi, Merkezi Derslik binasında gerçekleştirilen etkinlikte katılımcılar proje sunumları yaparak, dinleyicilerden geri bildirim aldı ve diğer disiplinlerden potansiyel iş ortaklarıyla tanıştı. İTÜ GİNOVA Genel Müdürü Doç. Dr. Adnan Veysel Ertemel, açılış konuşmasında ortak iş yapma kültürünün önemine dikkat çekti ve etkili konuşma, sunum yapmanın önemine vurgu yaptı.	2024-02-28 14:00:00	14:00	İTÜ Ayazağa Yerleşkesi, Merkezi Derslik Binası	/api/media/events/find-your-co-founder-2024.jpg	f	\N	t	admin-user	admin-user	2025-08-26 20:40:45.037356	2025-08-26 20:40:45.037356	find-your-co-founder-etkinligi-2024	/api/media/events/gallery/find-your-co-founder-2024/find-your-co-founder-grup.jpeg,/api/media/events/gallery/find-your-co-founder-2024/co-founder-sunum.png	upcoming
9	Sürdürülebilirlik ve İnovasyon Forumu	Çevre dostu teknolojiler, yeşil girişimcilik ve sürdürülebilir inovasyonlar üzerine forum. Impact investing konuları da ele alınacak.	2025-10-22 10:00:00	10:00	İTÜ Ayazağa Kampüsü	/api/media/events/sustainable-entrepreneurship.svg	f	\N	t	41781800	\N	2025-07-07 21:22:05.569276	2025-07-07 21:22:05.569276	surdurulebilirlik-ve-inovasyon-forumu	\N	upcoming
8	Yapay Zeka Girişimciliği Paneli	Yapay zeka alanında başarılı girişimcilerin deneyimlerini paylaştığı panel. Deep tech, AI ve robotik alanlarında fırsatlar.	2025-10-08 16:00:00	16:00	İTÜ Süleyman Demirel Kültür Merkezi	/api/media/events/ai-entrepreneurship.svg	f	\N	t	41781800	admin-user	2025-07-07 21:22:05.569276	2025-08-27 19:29:49.193	teknoloji-girisimciligi-paneli	\N	upcoming
7	AI ile Süreç İnovasyonu Workshop'u	Girişimciler için yapay zeka destekli süreç inovasyonu çözümleri üzerine uygulamalı eğitim.	2025-09-25 13:00:00	13:00	Med A Derslik 34	/api/media/events/ai-workshop.svg	f	\N	t	41781800	admin-user	2025-07-07 21:22:05.569276	2025-08-27 19:31:15.868	dijital-pazarlama-workshop	\N	upcoming
6	Startup Finansman Zirvesi	Girişimciler için yatırım fırsatları ve finansman stratejileri konuşulacak. Melek yatırımcılar ve VC fonları ile buluşma imkanı.	2025-09-15 14:00:00	14:00	İTÜ Ayazağa Kampüsü Konferans Salonu	/api/media/events/fintech-entrepreneurship.svg	f	\N	t	41781800	admin-user	2025-07-07 21:22:05.569276	2025-08-27 19:31:33.051	startup-finansman-zirvesi	\N	upcoming
14	STEM's Zirvesi: Sürdürülebilir Bir Gelecek İçin	İTÜ İşletme Mühendisliği Bölümü ve İTÜ GİNOVA tarafından düzenlenen STEM's (Bilim, Teknoloji, Mühendislik, Matematik) Zirvesi, "Sürdürülebilir bir gelecek için" mottosuyla 6-7 Aralık 2022 tarihlerinde İTÜ Ayazağa Yerleşkesi SDKM'de hibrit olarak gerçekleştirildi. Girişimcilik ve inovasyonu bilim, teknoloji, mühendislik ve matematikle birleştiren sunumlar, eğitimler ve networking etkinlikleri ile katılımcılara zengin bir deneyim sundu. Türkiye'den özel sektörün markalaşmış isimleriyle İTÜ'lüleri bir araya getiren zirve, STEM alanlarında sürdürülebilir teknolojilerin geleceği şekillendirmedeki rolüne odaklandı.	2022-12-06 09:00:00	09:00	İTÜ Ayazağa Yerleşkesi, Süleyman Demirel Kültür Merkezi	/api/media/events/stems-zirvesi-2022.jpg	t	\N	t	admin-user	admin-user	2025-08-27 07:45:44.546113	2025-08-27 07:45:44.546113	stems-zirvesi-surdurulebilir-gelecek-2022	/api/media/events/gallery/stems-zirvesi-2022/stem-katilimcilar.png,/api/media/events/gallery/stems-zirvesi-2022/stem-sunum.png,/api/media/events/gallery/stems-zirvesi-2022/stem-konusmacilar.jpg,/api/media/events/gallery/stems-zirvesi-2022/stem-workshop.png,/api/media/events/gallery/stems-zirvesi-2022/stem-networking.jpg	upcoming
16	İTÜ GİNOVA Jump Start Girişimciliğe Hızlı Başlangıç Programı 2025	İTÜ GİNOVA tarafından her dönem düzenlenen "Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı", 2024-2025 Bahar Dönemi eğitimlerine 19 Mart 2025'te başladı. 5 hafta sürecek program, girişimci adaylarına iş fikirlerini test etme, iş modeli oluşturma ve yatırımcı sunumlarına hazırlanma imkanı sunuyor. GOBI Partners General Partneri Erdem Dereli'nin de konuk olduğu açılış dersini Doç. Dr. Adnan Veysel Ertemel verdi. Program, Design Thinking, MVP geliştirme, teknoloji ticarileştirme gibi kritik konuları kapsıyor ve 14 Mayıs 2025'te Demo Day ile sona erecek.	2025-03-19 14:00:00	14:00	İTÜ GİNOVA, 1773 İTÜ Teknopark	/api/media/events/ginova-jump-start-2025.jpg	f	\N	t	admin-user	admin-user	2025-08-27 07:53:51.261586	2025-08-27 07:53:51.261586	ginova-jump-start-girisimcilik-hizli-baslangic-2025	/api/media/events/gallery/ginova-jump-start-2025/jump-start-tanitim.jpg,/api/media/events/gallery/ginova-jump-start-2025/jump-start-acilis-1.jpeg,/api/media/events/gallery/ginova-jump-start-2025/jump-start-acilis-2.jpeg,/api/media/events/gallery/ginova-jump-start-2025/jump-start-acilis-3.jpeg	upcoming
17	İTÜ GİK'25 - Girişimcilik, İnovasyon ve Kariyer Zirvesi	İTÜ GİNOVA ve İTÜ Kariyer ve Staj Merkezi işbirliğiyle düzenlenen İTÜ GİK'25, 18 Şubat 2025 tarihinde İTÜ Elektrik-Elektronik Fakültesi Ömer Korzay Konferans Salonu'nda gerçekleşti. Zirve, Dijital Dönüşüm, Growth Hacking, Kadın Girişimciliği, Yapay Zeka ve Girişimcilik, Yatırımcı Perspektifi gibi kritik konularda paneller sundu. Sektörün önde gelen isimleri olan Kadir Ceran, Sefa Karahan, Dr. Can Çoktuğ, Emine Erdem, Prof. Dr. Altan Çakır, Hakan Kesler gibi uzmanlar deneyimlerini paylaştı. Etkinlik, girişimcilik ekosistemine ilgi duyan öğrenciler ve profesyoneller için networking fırsatı sundu.	2025-02-18 09:00:00	09:00	İTÜ Elektrik-Elektronik Fakültesi, Ömer Korzay Konferans Salonu	/api/media/events/itu-gik-25-2025.jpg	f	\N	t	admin-user	admin-user	2025-08-27 07:57:59.253933	2025-08-27 07:57:59.253933	itu-gik-25-girisimcilik-inovasyon-kariyer-zirvesi	/api/media/events/gallery/itu-gik-25-2025/gik-kapak.png,/api/media/events/gallery/itu-gik-25-2025/gik-salon-1.jpg,/api/media/events/gallery/itu-gik-25-2025/gik-salon-2.jpg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-1.jpg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-2.jpg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-3.jpg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-4.jpeg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-5.jpeg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-6.jpeg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-7.jpeg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-8.jpeg,/api/media/events/gallery/itu-gik-25-2025/gik-panel-9.jpeg	upcoming
18	İTÜ GİNOVA Jump Start Demo Günü 2025	İTÜ GİNOVA tarafından düzenlenen Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı'nın 2025 Bahar dönemi, 14 Mayıs'ta gerçekleştirilen Demo Day etkinliğiyle tamamlandı. 7 haftalık yoğun eğitim sürecinde katılımcılar, tasarımsal düşünce, iş modeli kurgulama, teknoloji ticarileştirme konularında uzmanlaştı. Halkbank desteğiyle güçlenen programda, girişimciler iş fikirlerini sektörün önde gelen yatırımcı ve profesyonelleri karşısında sundular. Jüri değerlendirmesi sonucu PEKİ takımı birinciliği, Yasal Pusula ikinciliği, MyTale üçüncülüğü kazandı. Dereceye giren takımlar Halkbank, İTÜ Çekirdek, Strateji 360 ve LeanSoc destekleriyle ödüllendirildi.	2025-05-14 14:00:00	14:00	İTÜ GİNOVA, 1773 İTÜ Teknopark	/api/media/events/ginova-jump-start-demo-gunu-2025.jpg	f	\N	t	admin-user	admin-user	2025-08-27 08:01:55.895167	2025-08-27 08:01:55.895167	ginova-jump-start-demo-gunu-2025	/api/media/events/gallery/ginova-jump-start-demo-gunu-2025/demo-day-kapak.png,/api/media/events/gallery/ginova-jump-start-demo-gunu-2025/demo-day-sunum-1.jpg,/api/media/events/gallery/ginova-jump-start-demo-gunu-2025/demo-day-sunum-2.jpg,/api/media/events/gallery/ginova-jump-start-demo-gunu-2025/demo-day-sunum-3.jpg,/api/media/events/gallery/ginova-jump-start-demo-gunu-2025/demo-day-sunum-4.jpg,/api/media/events/gallery/ginova-jump-start-demo-gunu-2025/demo-day-sunum-5.jpg	upcoming
15	Çetin Ceviz Girişim Kampı 2021	İTÜ GİNOVA tarafından altıncısı düzenlenen Çetin Ceviz Girişim Kampı, "Fikrinden Startup Çıkar mı?" temasıyla gerçekleştirildi. Pandemi nedeniyle online ortamda düzenlenen kamp, girişimci ve yenilikçi fikirlerini ticari ürüne dönüştürmek isteyen üniversite öğrencileri ve yeni mezunları buluşturdu. Seçilen takımlar 21 Mart - 14 Nisan 2021 tarihleri arasında eğitmenlerle birlikte yoğun girişimcilik eğitimi aldı. Kampı başarıyla tamamlayan ekipler 5 bin TL ödül ve İTÜ Çekirdek Ön Kuluçka aşamasına kabul fırsatı elde etti. Program, zor sorunlara teknolojik girişimlerle çözüm geliştirmeyi amaçlıyor	2021-03-21 09:00:00	09:00	Online (İTÜ GİNOVA)	/api/media/events/cetin-ceviz-girisim-kampi-2021.jpg	t	\N	f	admin-user	admin-user	2025-08-27 07:50:08.043175	2025-08-27 09:45:26.21	cetin-ceviz-girisim-kampi-2021	/api/media/events/gallery/cetin-ceviz-girisim-kampi-2021/Startup_bootcamp_collaboration_scene_ee214542.png,/api/media/events/gallery/cetin-ceviz-girisim-kampi-2021/Çetin_Ceviz_innovation_symbol_e24ad807.png,/api/media/events/gallery/cetin-ceviz-girisim-kampi-2021/Startup_pitch_presentation_9fbaf071.png	upcoming
19	İTÜ GİNOVA Jump Start Girişimcilik Eğitim Programı 2024	İTÜ GİNOVA tarafından geleneksel olarak her dönem düzenlenen ve tüm İTÜ mensuplarına açık olan "Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı", 2024-2025 Güz dönemi eğitimlerine 23 Ekim 2024'te başladı. Doç. Dr. Adnan Veysel Ertemel'in "Girişimciliğe Giriş" dersiyle açılan programda katılımcılar, Design Thinking, teknoloji ticarileştirme, MVP geliştirme gibi konularda uzmanlaştı. MotivaCraft kurucusu Koray İnan'ın katkılarıyla asenkron eğitim modülleri de sunuldu. 30 saatlik eğitimi tamamlayanlar sertifika, mikro kredi, yatırımcı buluşması ve mentörlük fırsatları elde etti.	2024-10-23 14:00:00	14:00	İTÜ GİNOVA, 1773 İTÜ Teknopark	/api/media/events/ginova-jump-start-2024.jpg	f	\N	t	admin-user	admin-user	2025-08-27 08:06:31.863269	2025-08-27 08:06:31.863269	ginova-jump-start-girisimcilik-egitim-2024	/api/media/events/gallery/ginova-jump-start-2024/jump-start-2024-tanitim.png,/api/media/events/gallery/ginova-jump-start-2024/jump-start-2024-egitim-1.jpeg,/api/media/events/gallery/ginova-jump-start-2024/jump-start-2024-egitim-2.jpeg,/api/media/events/gallery/ginova-jump-start-2024/jump-start-2024-egitim-3.jpeg	upcoming
20	Fikri Sınai Haklar ve Ticarileştirme Stratejileri Etkinliği	İTÜ GİNOVA ve İTÜ Projeler Ofisi ortaklığıyla girişimcileri bilinçlendirmek için düzenlenen etkinlik kapsamında İlay Öziş ve Cihat Çetin öğrencilerle buluştu. İTÜ Projeler Ofisi FSMH Kıdemli Uzmanı İlay Öziş ve Ticarileştirme Müdür Yardımcısı Cihat Çetin, girişimcilerin fikirlerini patentleme, fikri sınai haklar ve ticarileştirme stratejileri konularında detaylı sunum gerçekleştirdi. Öğrenciler Melih Biçer ve Pelin Kaya da geliştirdikleri patentin İTÜ Projeler Ofisi-Windustry işbirliğiyle ticarileştirme sürecini paylaştı. Etkinlik girişimcilik yolculuğunda kritik adımları anlatan kapsamlı bir farkındalık yaratı.	2024-01-03 14:00:00	14:00	İTÜ GİNOVA, İTÜ Projeler Ofisi	/api/media/events/fikri-sinai-haklar-2024.jpg	f	\N	t	admin-user	admin-user	2025-08-27 08:16:36.040972	2025-08-27 08:16:36.040972	fikri-sinai-haklar-ticarilesme-stratejileri-2024	/api/media/events/gallery/fikri-sinai-haklar-2024/patent-etkinlik-tanitim.jpg,/api/media/events/gallery/fikri-sinai-haklar-2024/patent-etkinlik-1.jpeg,/api/media/events/gallery/fikri-sinai-haklar-2024/patent-etkinlik-2.jpeg,/api/media/events/gallery/fikri-sinai-haklar-2024/patent-etkinlik-3.jpeg,/api/media/events/gallery/fikri-sinai-haklar-2024/patent-etkinlik-4.jpeg	upcoming
21	İTÜ GİNOVA Jump Start Girişimcilik Eğitimleri 2024	İTÜ GİNOVA tarafından 2023-2024 bahar yarıyılında düzenlenen "Jump Start Girişimciliğe Hızlı Başlangıç Sertifika Programı" 13 Mart 2024'te ilk modülüyle başladı. Doç. Dr. Adnan Veysel Ertemel ve girişimci mezun Buğra Tosun'un sunumlarıyla açılan eğitimde girişimci adayları iş fikirlerini test etme, deney tasarlama, tasarımsal düşünce, iş modeli tasarımı ve yatırımcı sunumu hazırlığı konularında eğitim aldı. 30 saatlik programı tamamlayanlar 1773 İTÜ Teknopark ileri eğitimlerine katılma, yatırımcılarla buluşma ve uzman mentörlük alma şansı elde etti.	2024-03-13 14:00:00	14:00	İTÜ GİNOVA, 1773 İTÜ Teknopark	/api/media/events/jump-start-egitim-2024.jpg	f	\N	t	admin-user	admin-user	2025-08-27 09:10:52.143841	2025-08-27 09:10:52.143841	jump-start-girisimcilik-egitimleri-2024	/api/media/events/gallery/jump-start-egitim-2024/jump-start-egitim-tanitim.png,/api/media/events/gallery/jump-start-egitim-2024/jump-start-egitim-1.jpg,/api/media/events/gallery/jump-start-egitim-2024/jump-start-egitim-2.jpg,/api/media/events/gallery/jump-start-egitim-2024/jump-start-egitim-3.jpg	upcoming
22	ITU Ginova Networking Etkinliği	ITU Ginova ailesi olarak gerçekleştirdiğimiz networking etkinliğinde girişimciler, mentorlar ve sektör profesyonelleri bir araya geldi. Etkinlikte deneyim paylaşımları yapıldı ve yeni iş birlikleri kuruldu.	2024-12-15 18:30:00	18:30	ITU Arı 3 Teknokent	/attached_assets/networking-event-2024.svg	f		t	admin-user	\N	2025-08-28 13:53:17.88911	2025-08-28 13:53:17.88911	itu-ginova-networking-event-2024	/attached_assets/networking-gallery-1.svg,/attached_assets/networking-gallery-2.svg,/attached_assets/networking-gallery-3.svg	completed
23	Dijital Ürün Yönetiminde Kariyer ve Gelecek Trendleri 	🚀GİNOVA Town Hall Seminer Serisi Bahar\ndöneminde de hız kesmeden devam ediyor!\n\nBu hafta “ Dijital Ürün Yönetiminde Kariyer ve Gelecek Trendleri “ başlıklı konuşmasıyla Orhan Tanrıkulu bizlerle olacak.\n\n🗓️ Tarih: 21 Mayıs 2025 Çarşamba\n⏰ Saat: 16.00\n📍 Yer: MED-A Blok, A-34\n\nOrhan Tanrıkulu Hakkında:\nDijital ürün yönetimi alanında uzman, e-ticaret sektöründe deneyimli grup müdürü.\n\n🙌🏼 Yaratıcılık ve inovasyonun bilimle buluştuğu bu ilham verici seminere davetlisiniz!\n	2025-05-21 16:00:00	16:00			f		t	admin-user	admin-user	2025-08-28 14:05:46.37429	2025-08-28 14:05:46.37429	dijital-urun-yonetiminde-kariyer-ve-gelecek-trendleri		upcoming
\.


--
-- Data for Name: mentor_availability; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mentor_availability (id, mentor_id, day_of_week, start_time, end_time, is_active, created_at, updated_at) FROM stdin;
3	6	1	09:00	10:00	t	2025-08-28 16:39:17.862423	2025-08-28 16:39:17.862423
4	6	1	09:00	10:00	f	2025-08-28 16:40:05.235312	2025-08-28 16:40:05.235312
\.


--
-- Data for Name: mentor_bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mentor_bookings (id, mentor_id, applicant_name, applicant_email, applicant_phone, company, meeting_date, meeting_time, duration, topic, message, status, meeting_link, notes, created_at, updated_at) FROM stdin;
1	6	Unitic Egitim ve Pazarlama Limited Sirketi	uniticmarketing@gmail.com	\N	Unitic	2025-09-01	09:00	30	test	retwefsf	pending	\N	\N	2025-08-28 16:40:59.455039	2025-08-28 16:40:59.455039
2	6	Unitic Egitim ve Pazarlama Limited Sirketi	uniticmarketing@gmail.com	\N	Unitic	2025-09-01	09:00	30	test	retwefsf	pending	\N	\N	2025-08-28 16:41:03.128475	2025-08-28 16:41:03.128475
\.


--
-- Data for Name: mentors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.mentors (id, name, title, expertise, image, linkedin, email, bio, is_active, created_by, updated_by, created_at, updated_at, is_available_for_booking) FROM stdin;
3	SERKAN KAV	Founder & Digital Transformation Leader	Digital Transformation, Innovation, Technology Strategy, Business Management, Solution Architecture	/objects/uploads/b695c3df-1bf3-4064-b710-679775375686.jpg			Founder @ Y | COO | CMO | CSO | Innovation&Digital Transformation Leader | Technology Strategy | Executive Business Management | Senior Solution Architect | Transformation Leader | CX | Entrepreneur	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 13:15:59.521	f
12	SAMİ SERDAR	International İncubation Center	Uluslararası İnkübasyonm, Global Pazarlama, İş Geliştirme	/api/media/mentors/sami-serdar.svg			International İncubation Center uzmanı, küresel girişimcilik danışmanı	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:04:52.536	f
11	ATAKAN KARATAŞ	Startup Centrum	Startup Geliştirme, İş Geliştirme, Girişimcilik	/api/media/mentors/atakan-karatas.svg			Startup Centrum uzmanı, girişimcilik ve iş geliştirme alanında deneyimli mentor	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:05:00.828	f
13	GÜVEN KARAÖZ	İnnotalent+ Uzmanı	İnovasyon Yönetimi, Talent Management, İnsan Kaynakları	/api/media/mentors/guven-karaoz.svg			İnnotalent+ uzmanı, yetenek yönetimi ve inovasyon lideri	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:05:06.147	f
14	MURAT PEKSAVAŞ	Binovative Uzmanı	Biyolojik İnovasyon, R&D, Teknoloji Transferi	/api/media/mentors/murat-peksavas.svg			Binovative uzmanı, biyolojik inovasyon ve teknoloji geliştirme alanında deneyimli	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:05:12.523	f
15	ONUR YOLAY	TechTransfer Uzmanı	Teknoloji Transferi, Üniversite Sanayi İşbirlifi, Ar-Ge	/api/media/mentors/onur-yolay.svg			TechTransfer uzmanı, teknoloji ticarileştirme ve transfer süreçlerinde deneyimli	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:05:21.284	f
16	NECMETTİN GÜRSES	ICYF Uzmanı	Gençlik Girişimciliği, Proje Yönetimi, Sosyal İnovasyon	/api/media/mentors/necmettin-gurses.svg			ICYF uzmanı, gençlik girişimciliği ve sosyal inovasyon alanında aktif	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:05:26.143	f
10	KÖKSAL MERTCAN AKTAŞ	Engineering Student	Aeronautical Engineering, Mathematics, Engineering, Academia	/objects/uploads/5a661912-2df2-4022-bdaa-1f95c97d2b01.jpg			Aeronautical Engineering and Mathematics Engineering Student at Istanbul Technical University	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 13:19:24.903	f
7	SEFA KARAHAN	Marketing & Growth Strategist	Marketing, Growth Strategy, Digital Marketing, Brand Strategy	/objects/uploads/572c0b99-eab0-4942-8ef9-2e14b7d3edc0.jpg			Marketing & Brand Strategist | President @1,618 Agency	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 13:42:01.359	f
4	KORAY İNAN	Co-founder @Motivacraft | Sales Coach	Sales, NLP, Coaching, Project Management, Financial Analysis	/objects/uploads/74316d84-33ca-4893-a67b-b14111c1cee4.jpg			Co-founder @Motivacraft | Author of Sales 4.0 & Satışın NLP'si | Mentor & Advisory Board Member @ITU Ginova | Sales Coach & Mentor | Etkin Proje Management & Financial Analysis | NLP Practitioner by Richard Bandler	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 13:28:48.451	f
9	BURAK ÇEVİK	Senior Product Designer	Product Design, UX/UI Design, Digital Design, User Experience	/objects/uploads/75e8077e-2023-477c-a4ae-39091668b624.jpg			Senior Product Designer @BTS group	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 13:42:18.263	f
6	Dr. CAN ÇOKTUĞ	Growth Specialist | Academician	Growth Strategy, Academia, Startup Mentoring, Lecturing	/objects/uploads/89ccf061-359b-4821-81eb-ca548201dff8.jpg			Growth Specialist | Academician | Lecturer | Start up Mentor	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 16:35:47.477	t
5	CİHAT ÇETİN	Founder & CEO - Technology Transfer Professional	Technology Transfer, Entrepreneurship, R&D, Innovation Management	/objects/uploads/31648518-781a-4464-8ee3-9b881110778f.jpg			Founder & CEO - Technology Transfer Professional, RTTP	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 13:33:54.09	f
8	İLAY ÖZİŞ	FSMH Yönetimi	Management, Healthcare, Administration, Strategy	/objects/uploads/6118faf0-7d36-4280-bf3c-b2949a493561.jpg			FSMH Yönetimi, RTTP c.	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 16:38:42.423	f
2	ALİ NİHAT UZUNALİOĞLU	Co-founder Y Innovation and Technology Inc.	Artificial Intelligence, Innovation, Technology, Entrepreneurship	/objects/uploads/2292d8d5-7f60-41e0-bc2d-3bf90343ff2d.jpg			Co-founder Y Innovation and Technology Inc. | MSc Artificial Intelligence, Amsterdam	t	\N	admin-user	2025-08-28 12:21:14.506802	2025-08-28 13:15:47.398	f
17	İLHAN ALAN	Multicorn Teknoloji	Teknoloji Geliştirme, Yazılım, Multi-platform Çözümler	/api/media/mentors/ilhan-alan.svg			Multicorn Teknoloji uzmanı, teknoloji geliştirme ve yazılım çözümlerinde deneyimli	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:05:59.387	f
18	YUSUF ŞAHİN	NEURA Accounting Mali Müşavir	Mali Müşavirlik, Finansal Planlama, Muhasebe	/api/media/mentors/yusuf-sahin.svg			NEURA Accounting mali müşaviri, finansal danışmanlık ve muhasebe uzmanı	t	\N	admin-user	2025-08-28 12:57:21.013874	2025-08-28 13:06:05.361	f
19	JAMAL AGHAYEV	Innovation and Digital Transformation	Digital Transformation, İnovasyon Yönetimi, Teknoloji Stratejisi	/api/media/mentors/jamal-aghayev.svg			Innovation and Digital Transformation uzmanı, dijital dönüşüm lideri	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:06:10.542	f
20	HAYDAR ÖZKÖMÜRCÜ	Cremico Uzmanı	Gıda Teknolojisi, Ürün Geliştirme, İnovatif Çözümler	/api/media/mentors/haydar-ozkomurcu.svg			Cremico uzmanı, gıda teknolojisi ve ürün inovasyonu alanında deneyimli	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:06:15.282	f
21	UTKAN BOSTANCI	StartupCentrum	Startup Mentoring, İş Geliştirme, Girişimcilik	/api/media/mentors/utkan-bostanci.svg			StartupCentrum uzmanı, startup mentoring ve iş geliştirme danışmanı	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:06:20.19	f
22	MÜGE BEZGİN	StartupCentrum - Pazarlama	Dijital Pazarlama, Marka Stratejisi, Growth Marketing	/api/media/mentors/muge-bezgin.svg			StartupCentrum pazarlama uzmanı, dijital pazarlama ve marka geliştirme danışmanı	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:06:25.846	f
23	NİZAMETTİN SAMİ HARPUTLU	StartupCentrum	Startup Ecosystem, İş Geliştirme, Mentor Network	/objects/uploads/46ea4e10-1528-4bb5-bfde-bdb701a3bdb7.jpg			StartupCentrum uzmanı, startup ekosistemi ve mentorluk ağı geliştirme danışmanı	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:10:06.839	f
28	MİNE DEDEKOCA	Zindhu	E-ticaret, Platform Geliştirme, Dijital Pazarlama	/objects/uploads/b31eee05-24a3-4c6c-90d7-c05bc6960497.jpg			Zindhu uzmanı, e-ticaret platform geliştirme ve dijital pazarlama danışmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:43:51.626	f
25	ORHAN YILDIRIM	HepsiEmlak	Emlak Teknolojisi, Platform Geliştirme, Dijital Emlak	/api/media/mentors/orhan-yildirim.svg			HepsiEmlak uzmanı, emlak teknolojisi ve platform geliştirme danışmanı	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:07:33.212	f
26	KADİR CAN KIRKOYUN	Üretken Akademi	Eğitim Teknolojisi, Online Öğrenme, İçerik Geliştirme	/api/media/mentors/kadir-can-kirkoyun.svg			Üretken Akademi uzmanı, eğitim teknolojisi ve öğrenme platformları danışmanı	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:07:52.701	f
29	KADİR CERAN	İnovasyon Çoğaltıcısı	İnovasyon Metodolojisi, R&D Yönetimi, Teknoloji Transferi	/objects/uploads/6a72117b-2639-4446-80f0-e2c9b6beca2f.jpg			İnovasyon çoğaltıcısı uzmanı, inovasyon süreçleri ve teknoloji geliştirme danışmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:44:05.23	f
30	HAKAN KESLER	Tracker Agency	Dijital Ajans Yönetimi, Performance Marketing, Veri Analizi	/objects/uploads/2ce9a5f8-c4d8-4c87-ae95-eec46fe5a5c5.jpg			Tracker Agency uzmanı, dijital ajans yönetimi ve performans pazarlama danışmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:11:02.344	f
32	UYGUN BODUR	Software Specialist	Yazılım Geliştirme, Teknik Mimari, Full-Stack Development	/api/media/mentors/uygun-bodur.svg			Yazılım uzmanı, teknik mimari ve full-stack geliştirme danışmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:09:22.643	f
33	MELİH EFEOĞLU	Geometry Venture Development	Venture Capital, Startup Investment, İş Geliştirme	/api/media/mentors/melih-efeoglu.svg			Geometry Venture Development uzmanı, startup yatırım ve iş geliştirme danışmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:09:30.059	f
34	DR. CEM ALPPAY	İTÜ Endüstriyel Tasarım	Endüstriyel Tasarım, Ürün Geliştirme, Tasarım Stratejisi	/api/media/mentors/cem-alppay.svg			İTÜ Endüstriyel Tasarım öğretim üyesi, ürün tasarım ve geliştirme uzmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:09:35.641	f
35	PROF. DR. ÇİĞDEM KAYA	İTÜ Endüstriyel Tasarım	Endüstriyel Tasarım, Kullanıcı Deneyimi, Sürdürülebilir Tasarım	/api/media/mentors/cigdem-kaya.svg			İTÜ Endüstriyel Tasarım profesörü, kullanıcı odaklı tasarım ve sürdürülebilirlik uzmanı	t	\N	admin-user	2025-08-28 12:58:03.113468	2025-08-28 13:09:41.045	f
36	AYDIN YAŞAR	BAU Uzmanı	Üniversite Sanayi İşbirliği, Akademik Girişimcilik, Eğitim İnovasyonu	/api/media/mentors/aydin-yasar.svg			Bahçeşehir Üniversitesi uzmanı, akademik girişimcilik ve eğitim inovasyonu danışmanı	t	\N	admin-user	2025-08-28 12:58:03.113468	2025-08-28 13:09:47.276	f
31	OYTUN EREN ŞENGÜL	Dream Games	Oyun Geliştirme, Mobile Gaming, Ürün Yönetimi	/objects/uploads/3a562f82-7213-4e79-a382-2fc0710f1b49.jpg			Dream Games uzmanı, mobil oyun geliştirme ve ürün yönetimi danışmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:44:22.353	f
24	GÖNÜL DAMLA GÜVEN	Girişimcilik Danışmanı	Kadın Girişimciliği, Sosyal İnovasyon, Proje Geliştirme	/objects/uploads/15af4175-90ed-400e-8701-8daadc998716.jpg			Kadın girişimciliği ve sosyal inovasyon alanında aktif danışman	t	\N	admin-user	2025-08-28 12:57:37.167593	2025-08-28 13:42:55.179	f
27	REŞAT GÖKAY ÇELİK	Collective Idea	Kolektif Yaratıcılık, İnovasyon Yönetimi, Tasarım Düşüncesi	/objects/uploads/5635a89c-5773-4176-b0dd-b921cde82503.jpg			Collective Idea uzmanı, kolektif yaratıcılık ve inovasyon metodolojisi danışmanı	t	\N	admin-user	2025-08-28 12:57:55.690631	2025-08-28 13:43:39.489	f
\.


--
-- Data for Name: programs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.programs (id, name, description, duration, icon, image, is_active, created_by, updated_by, created_at, updated_at, title, short_description, level, category, price, capacity, application_deadline, start_date, end_date, location, requirements, syllabus, instructors, is_published) FROM stdin;
5	surdurulebilir-inovasyon	Çevre dostu ve sürdürülebilir teknolojiler geliştirmek isteyen girişimciler için özel program. Yeşil teknolojiler, temiz enerji ve circular economy konularında projeler geliştirin.	8 hafta	🌱	/api/media/programs/sustainable-innovation.jpg	t	41781800	\N	2025-07-07 20:09:54.111493	2025-07-07 20:09:54.111493	Sürdürülebilir İnovasyon	Sürdürülebilirlik odaklı 8 haftalık inovasyon programı	Orta	İnovasyon	Ücretsiz	20	2025-03-10 00:00:00	2025-04-01 00:00:00	2025-05-27 00:00:00	Hibrit	Çevre mühendisliği, endüstri mühendisliği veya ilgili alanlarda eğitim	Hafta 1-2: Sürdürülebilir Kalkınma\\nHafta 3-4: Temiz Enerji Teknolojileri\\nHafta 5-6: Circular Economy\\nHafta 7-8: Yeşil Girişimcilik	Prof. Dr. Aylin Kocaman (Çevre Müh.), Tolga Özmen (Cleantech Girişimcisi)	t
3	growth-hacking-uzmanligi	Hızla büyümeyi hedefleyen startuplar için hazırlanmış başarılı bir Scale up operasyonu eğitim programı.	6 hafta	📱	/api/media/programs/digital-marketing.jpg	t	41781800	admin-user	2025-07-07 20:09:54.111493	2025-08-28 15:02:09.519	Growth Hacking Uzmanlığı	Büyüme, analitik ve pazarlama 6 haftalık program	Başlangıç	Pazarlama	Ücretsiz	30	2025-02-20 00:00:00	2025-03-08 00:00:00	2025-04-19 00:00:00	Online	Pazarlama alanında ilgi sahibi olmak, temel bilgisayar kullanımı	Hafta 1: Dijital Pazarlama Temelleri\\nHafta 2: İş Modeli ve Büyüme İlişkisi\\nHafta 3: Traction Kanalları\\nHafta 4: Funnel Optimizasyonu\\nHafta 5: Büyüme Stratejileri\\nHafta 6: Analitik ve Ölçümleme	Doç.Dr. Adnan Veysel ERTEMEL, Dr.Can ÇOKTUĞ	t
1	jump-start	Sıfırdan bir girişim kurmak isteyen adaylar için kapsamlı bir eğitim programı. İş planı hazırlama, pazar analizi, finansman kaynakları ve yasal süreçler hakkında detaylı bilgi edinin.	8 hafta	🚀	/api/media/programs/startup-bootcamp.jpg	t	41781800	admin-user	2025-07-07 20:09:54.111493	2025-08-28 14:57:02.267	Jump Start	12 haftalık yoğun girişimcilik eğitimi	Başlangıç	Girişimcilik	Ücretsiz	25	2025-02-15 00:00:00	2025-03-01 00:00:00	2025-05-24 00:00:00	İTÜ Teknokent	Üniversite mezunu veya son sınıf öğrencisi olmak, girişimcilik alanında ciddi niyet sahibi olmak	Hafta 1-2: Girişimcilik Temelleri\\nHafta 3-4: İş Modeli Geliştirme\\nHafta 5-6: Pazar Analizi\\nHafta 7-8: Finansman ve Yatırım\\nHafta 9-10: Yasal Süreçler\\nHafta 11-12: Pitch ve Sunum	Doç.Dr. Adnan Veysel ERTEMEL, Dr. Can ÇOKTUĞ, Burak ÇEVİK	t
2	teknoloji-inovasyon	Teknoloji tabanlı inovasyon projelerini hayata geçirmek isteyen mühendis ve geliştiriciler için özel olarak tasarlanmış program. AR/VR, AI, IoT gibi gelişmekte olan teknolojilerde uzmanlaşın.	8 hafta	🔬	/api/media/programs/tech-innovation.jpg	t	41781800	admin-user	2025-07-07 20:09:54.111493	2025-08-28 14:57:45.145	Teknoloji İnovasyonu Programı	Teknoloji odaklı 8 haftalık inovasyon programı	Orta	Teknoloji	Başvuru üzerine	20	2025-02-28 00:00:00	2025-03-15 00:00:00	2025-05-10 00:00:00	Hibrit	Mühendislik veya bilgisayar bilimleri mezunu, temel programlama bilgisi	Hafta 1-2: Teknoloji Trendleri\\nHafta 3-4: AI ve Machine Learning\\nHafta 5-6: IoT ve Sensör Teknolojileri\\nHafta 7-8: Prototip Geliştirme	Doç. Dr. Adnan Veysel ERTEMEL	t
4	fintech-blockchain	Finansal teknolojiler ve blockchain alanında çığır açan projeleri hayata geçirmek isteyenler için ileri seviye program. DeFi, NFT, smart contracts konularında derinlemesine bilgi.	10 hafta	₿	/api/media/programs/fintech-blockchain.jpg	t	41781800	admin-user	2025-07-07 20:09:54.111493	2025-08-28 15:02:28.801	Fintech ve Blockchain	Fintech ve blockchain odaklı 10 haftalık ileri program	İleri	Finans	Ücretli	15	2025-03-01 00:00:00	2025-03-20 00:00:00	2025-05-29 00:00:00	İTÜ Teknokent	Yazılım geliştirme deneyimi, finansal piyasalar hakkında temel bilgi	Hafta 1-2: Blockchain Temelleri\\nHafta 3-4: Smart Contracts\\nHafta 5-6: DeFi Protokolleri\\nHafta 7-8: NFT ve Token Ekonomisi\\nHafta 9-10: Fintech Girişim Kurmak	Doç. Dr. Adnan Veysel ERTEMEL, Dr. Can ÇOKTUĞ, Hakan KESLER	f
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.projects (id, title, description, slug, status, supporter, budget_amount, budget_currency, is_active, created_by, updated_by, created_at, updated_at, type, task, duration) FROM stdin;
2	STEM_Valorisation Training Programme		stem-valorisation-training-programme	completed	AB Komisyonu	266550	EUR	t	\N	admin-user	2025-08-27 15:31:52.592921+00	2025-08-27 15:52:07.729+00	AB Erasmus Plus	Yürütücü	24 ay
4	SME Cluster Growth		sme-cluster-growth	completed	AB Komisyonu	999977	EUR	t	\N	admin-user	2025-08-27 15:31:52.592921+00	2025-08-27 15:53:58.497+00	AB Erasmus Plus	Ortak Yürütücü	12 ay
5	Women Entrepreneurs in Regional Inclusive Ecosystems – WeRIn		women-entrepreneurs-in-regional-inclusive-ecosystems-werin	completed	AB Komisyonu	999639	EUR	t	\N	admin-user	2025-08-27 15:31:52.592921+00	2025-08-27 15:55:03.963+00	 AB Erasmus Plus	Ortak Yürütücü	12 ay
1	Technological Wellness for Young People		technological-wellness-for-young-people	ongoing	Avrupa Birliği Eğitim ve Gençlik Programları Merkezi Başkanlığı (Türkiye Ulusal Ajansı)	250000.00	EUR	t	\N	admin-user	2025-08-27 15:31:52.592921+00	2025-08-27 15:49:30.76+00	AB Erasmus Plus	Yürütücü	2024-2026
3	Boundary Spanners Development Programme		boundary-spanners-development-programme	completed	AB Komisyonu	773838	EUR	t	\N	admin-user	2025-08-27 15:31:52.592921+00	2025-08-27 15:50:12.641+00	AB Erasmus Plus	Ortak Yürütücü	2019-2021
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sessions (sid, sess, expire) FROM stdin;
-ZsVduZcQPl6eRRywyuMTy6zOPeHvHOJ	{"cookie":{"originalMaxAge":604800000,"expires":"2025-09-03T20:37:52.961Z","secure":false,"httpOnly":true,"path":"/"},"passport":{"user":"admin-user"}}	2025-09-10 12:36:24
\.


--
-- Data for Name: startups; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.startups (id, name, category, description, funding, status, icon, website, is_active, created_by, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.team_members (id, name, title, image, bio, linkedin, email, is_board, "order", is_active, created_by, updated_by, created_at, updated_at, category) FROM stdin;
7	Dr. Tankut Akgül	Yönetim Kurulu Üyesi	/objects/uploads/cc5b1706-dd0d-44d8-8a03-65b909b0691b.jpg		https://www.linkedin.com/in/tankut-akgul-537b6b5/		t	6	t	admin-user	admin-user	2025-08-27 13:14:01.082756	2025-08-28 14:19:11.669	yonetim
6	Prof. Dr. Ramazan Evren	Yönetim Kurulu Üyesi	https://media.licdn.com/dms/image/C4D03AQGsQp7Yj2CdHw/profile-displayphoto-shrink_200_200/0/1608125047561				t	6	t	\N	admin-user	2025-08-27 13:01:27.026005	2025-08-27 13:13:09.732	yonetim
1	Doç.Dr.Adnan Veysel ERTEMEL	Merkez Müdürü	/objects/uploads/7f3426bd-ea78-483b-97fe-20821bb7c6fb.jpg		https://www.linkedin.com/in/adnanertemel/	ertemelav@itu.edu.tr	t	1	t	\N	admin-user	2025-08-27 13:01:27.026005	2025-08-27 13:38:33.193	yonetim
2	Prof. Dr. Mehmet Erçek	Merkez Müdür Yardımcısı	/objects/uploads/b3dbc49e-9ff3-4643-8921-11a936cb1f7d.jpg		https://www.linkedin.com/in/mehmet-ercek-18895030/		t	2	t	\N	admin-user	2025-08-27 13:01:27.026005	2025-08-27 13:46:44.439	yonetim
4	Prof. Dr. Hatice Camgöz Akdağ	Yönetim Kurulu Üyesi	/objects/uploads/cad2ceba-807d-4e6d-901b-ec57fb0dde84.jpg		https://www.linkedin.com/in/hatice-camgoz-akdag-b870378/		t	4	t	\N	admin-user	2025-08-27 13:01:27.026005	2025-08-27 13:47:11.432	yonetim
5	Doç. Dr. Deniz Tunçalp	Yönetim Kurulu Üyesi	/objects/uploads/d533a130-6a82-492e-8338-700c6114c242.jpg	Eğitim programları ve etkinlik yönetimi uzmanı.	https://www.linkedin.com/in/deniztuncalp/		t	5	t	\N	admin-user	2025-08-27 13:01:27.026005	2025-08-27 13:47:22.932	yonetim
3	Prof. Dr. Fethi Çalışır	Yönetim Kurulu Üyesi	/objects/uploads/2b399ac9-e455-4560-ad2b-21c3c01edeea.jpg		https://www.linkedin.com/in/fethi-%C3%A7al%C4%B1%C5%9F%C4%B1r-168bb64/		t	3	t	\N	admin-user	2025-08-27 13:01:27.026005	2025-08-27 13:48:01.24	yonetim
13	Öğr. Gör. Dr. Ali Ercan Özgür	IDEMA	data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="%23e5e7eb"%3E%3Cpath d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM12 14.2C13.5 14.2 15.1 14.4 16.2 15.4C17 16.1 17.5 17.1 17.5 18.2V20H6.5V18.2C6.5 17.1 7 16.1 7.8 15.4C8.9 14.4 10.5 14.2 12 14.2Z"/%3E%3C/svg%3E	\N	\N	\N	f	3	t	admin-user	\N	2025-08-27 14:08:28.069354	2025-08-27 14:08:28.069354	danisma
11	Prof. Dr. Metin Orhan Kaya	İTÜ	/objects/uploads/704181fd-177a-4d7c-879e-ed9c588a0f8e.jpg		https://www.linkedin.com/in/metin-orhan-kaya-461445121/		f	1	t	admin-user	admin-user	2025-08-27 14:08:28.069354	2025-08-27 14:10:29.222	danisma
12	Prof. Dr. Altan Çakır	İTÜ	/objects/uploads/4e420b0d-2b3a-41fa-bf63-0ff2f9263d06.jpg				f	2	t	admin-user	admin-user	2025-08-27 14:08:28.069354	2025-08-27 14:11:35.542	danisma
15	Engin Özeren	İçerik Üreticisi - Serbest Çalışan	/objects/uploads/9c876713-2519-42bc-9077-94a1912db17d.jpg				f	5	t	admin-user	admin-user	2025-08-27 14:08:28.069354	2025-08-27 14:11:59.939	danisma
18	Mustafa DALCI	Taptoweb - Tasarımcı	/objects/uploads/82ca4970-ab56-45a8-8ae6-5701f22e12ac.jpg				f	8	t	admin-user	admin-user	2025-08-27 14:08:44.825106	2025-08-27 14:12:14.921	danisma
19	Gönül Damla GÜVEN	Projectiw - Kurucu	/objects/uploads/0a216745-b618-488a-835a-db1486ac5d8e.jpg				f	9	t	admin-user	admin-user	2025-08-27 14:08:44.825106	2025-08-27 14:12:27.841	danisma
20	Koran İnan	Motiva Craft - Kurucu	/objects/uploads/c2472ac7-d642-4422-a2f4-0ce0abf67234.jpg				f	10	t	admin-user	admin-user	2025-08-27 14:08:44.825106	2025-08-27 14:12:41.846	danisma
21	Sefa KARAHAN	Digital Up - Yönetici	/objects/uploads/fb93e894-ee4c-4c3d-a6d4-5122f41bfff4.jpg				f	11	t	admin-user	admin-user	2025-08-27 14:08:44.825106	2025-08-27 14:12:51.623	danisma
22	Oytun Eren ŞENGÜL	Dream Games - Kurucu Ortak	/objects/uploads/5944039c-e341-45a7-abdb-1bc743cd4473.jpg				f	12	t	admin-user	admin-user	2025-08-27 14:08:44.825106	2025-08-27 14:13:01.684	danisma
9	Dr.Can ÇOKTUĞ	Unitic.co - Kurucu - Growth Specialist	/objects/uploads/4cd1df92-1169-49a5-b3ca-7fdf069cc139.jpg		https://www.linkedin.com/in/can-coktug/	can@uniticmarketing.com	f	8	t	admin-user	admin-user	2025-08-27 14:05:59.213545	2025-08-27 14:14:02.705	danisma
14	Dr. Kadir Ceran	TÜBİTAK & The Magick Company	/objects/uploads/9cface48-53f8-4fda-b6db-ba4d8ef3d22e.jpg				f	4	t	admin-user	admin-user	2025-08-27 14:08:28.069354	2025-08-28 14:18:42.027	danisma
16	Mine Dedekoca	Happy Work Studio - Kurucu	/objects/uploads/6f963b90-68ac-441b-9dfa-520b8063aa6a.jpg				f	6	t	admin-user	admin-user	2025-08-27 14:08:28.069354	2025-08-28 14:19:25.378	danisma
17	Nizamettin Sami Harputlu	Startup Centrum - Kurucu	/objects/uploads/2a75e265-3e9e-4c5b-a3da-315d3a778acf.jpg				f	7	t	admin-user	admin-user	2025-08-27 14:08:44.825106	2025-08-28 14:19:36.567	danisma
8	Öğr. Gör. Dr.Şükrü Alper Yurttaş	Program Koordinatörü	/objects/uploads/6e692c6c-7739-41a0-9653-523489ceccfd.jpg		https://www.linkedin.com/in/alper-yurtta%C5%9F-3a07b819/		f	7	t	admin-user	admin-user	2025-08-27 14:02:10.025781	2025-08-28 14:22:03.959	ekip
23	Esin Erdoğan	Etkinlik Koordinatörü	/objects/uploads/e05a9d19-377f-4cdb-ad09-d6a318d0fc2b.jpg		https://www.linkedin.com/in/esin-erdo%C4%9Fan-169b42153/		f	21	t	admin-user	admin-user	2025-08-28 14:20:43.138745	2025-08-28 14:22:37.075	ekip
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, is_active, created_at, updated_at, last_login_at, password) FROM stdin;
41781800	cancoktug@gmail.com	Can	Çoktuğ	\N	admin	t	2025-07-07 19:03:59.709534	2025-07-07 21:44:17.613	2025-07-08 17:37:32.131	\N
admin-user	admin@ginova.itu.edu.tr	Admin	User	\N	admin	t	2025-08-22 16:06:41.992386	2025-08-22 16:06:41.992386	\N	39985ef5b9ce049f7100168a0d9a7b5663562685ec56681694ae372a61ad68e33d66d90741674f08649f5215669ec72f1740c66b362e0dd45042a73514af55a2.62759e4b861bf75be0045374fe4cc711
\.


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.applications_id_seq', 1, false);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 24, true);


--
-- Name: event_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.event_applications_id_seq', 2, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.events_id_seq', 23, true);


--
-- Name: mentor_availability_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mentor_availability_id_seq', 4, true);


--
-- Name: mentor_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mentor_bookings_id_seq', 2, true);


--
-- Name: mentors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.mentors_id_seq', 36, true);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.programs_id_seq', 5, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.projects_id_seq', 5, true);


--
-- Name: startups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.startups_id_seq', 1, false);


--
-- Name: team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.team_members_id_seq', 23, true);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: event_applications event_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.event_applications
    ADD CONSTRAINT event_applications_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: events events_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_slug_key UNIQUE (slug);


--
-- Name: mentor_availability mentor_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentor_availability
    ADD CONSTRAINT mentor_availability_pkey PRIMARY KEY (id);


--
-- Name: mentor_bookings mentor_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentor_bookings
    ADD CONSTRAINT mentor_bookings_pkey PRIMARY KEY (id);


--
-- Name: mentors mentors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentors
    ADD CONSTRAINT mentors_pkey PRIMARY KEY (id);


--
-- Name: programs programs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_slug_key UNIQUE (slug);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: startups startups_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.startups
    ADD CONSTRAINT startups_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: applications applications_program_id_programs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_program_id_programs_id_fk FOREIGN KEY (program_id) REFERENCES public.programs(id);


--
-- Name: applications applications_reviewed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_reviewed_by_users_id_fk FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: blog_posts blog_posts_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: blog_posts blog_posts_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: event_applications event_applications_event_id_events_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.event_applications
    ADD CONSTRAINT event_applications_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: event_applications event_applications_reviewed_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.event_applications
    ADD CONSTRAINT event_applications_reviewed_by_users_id_fk FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: events events_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: events events_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: mentor_availability mentor_availability_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentor_availability
    ADD CONSTRAINT mentor_availability_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.mentors(id) ON DELETE CASCADE;


--
-- Name: mentor_bookings mentor_bookings_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentor_bookings
    ADD CONSTRAINT mentor_bookings_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.mentors(id) ON DELETE CASCADE;


--
-- Name: mentors mentors_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentors
    ADD CONSTRAINT mentors_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: mentors mentors_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.mentors
    ADD CONSTRAINT mentors_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: programs programs_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: programs programs_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.programs
    ADD CONSTRAINT programs_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: startups startups_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.startups
    ADD CONSTRAINT startups_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: startups startups_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.startups
    ADD CONSTRAINT startups_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: team_members team_members_created_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_created_by_users_id_fk FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: team_members team_members_updated_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_updated_by_users_id_fk FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

