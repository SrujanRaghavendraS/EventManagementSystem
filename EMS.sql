PGDMP                       }            Event Management    15.0    17.1 /    4           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            5           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            6           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            7           1262    25003    Event Management    DATABASE     �   CREATE DATABASE "Event Management" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
 "   DROP DATABASE "Event Management";
                     postgres    false            �            1259    25066    completed_tasks    TABLE     �   CREATE TABLE public.completed_tasks (
    task_description character varying(255) NOT NULL,
    task_assignee integer NOT NULL,
    event_id integer
);
 #   DROP TABLE public.completed_tasks;
       public         heap r       postgres    false            �            1259    25019    events    TABLE       CREATE TABLE public.events (
    event_id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    event_organiser integer,
    event_date date NOT NULL,
    event_time time without time zone NOT NULL,
    event_location character varying(255) NOT NULL,
    event_participants integer[] NOT NULL,
    event_status character varying(50),
    CONSTRAINT events_event_status_check CHECK (((event_status)::text = ANY ((ARRAY['Scheduled'::character varying, 'Ongoing'::character varying, 'Completed'::character varying])::text[])))
);
    DROP TABLE public.events;
       public         heap r       postgres    false            �            1259    25054    events_completed    TABLE       CREATE TABLE public.events_completed (
    event_id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    event_organiser integer,
    event_date_completed date NOT NULL,
    event_location character varying(255) NOT NULL,
    event_participants integer[] NOT NULL
);
 $   DROP TABLE public.events_completed;
       public         heap r       postgres    false            �            1259    25018    events_event_id_seq    SEQUENCE     �   CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.events_event_id_seq;
       public               postgres    false    217            8           0    0    events_event_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;
          public               postgres    false    216            �            1259    25082 
   post_tasks    TABLE     �   CREATE TABLE public.post_tasks (
    task_id integer NOT NULL,
    task_description character varying(255) NOT NULL,
    event_id integer,
    task_deadline date
);
    DROP TABLE public.post_tasks;
       public         heap r       postgres    false            �            1259    25081    post_tasks_task_id_seq    SEQUENCE     �   CREATE SEQUENCE public.post_tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.post_tasks_task_id_seq;
       public               postgres    false    223            9           0    0    post_tasks_task_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.post_tasks_task_id_seq OWNED BY public.post_tasks.task_id;
          public               postgres    false    222            �            1259    25035    tasks    TABLE     �  CREATE TABLE public.tasks (
    task_id integer NOT NULL,
    task_description character varying(255) NOT NULL,
    task_assignee integer,
    event_id integer,
    task_status character varying(50) NOT NULL,
    task_remarks text,
    task_deadline date NOT NULL,
    CONSTRAINT tasks_task_status_check CHECK (((task_status)::text = ANY ((ARRAY['Pending'::character varying, 'In Progress'::character varying, 'Completed'::character varying])::text[])))
);
    DROP TABLE public.tasks;
       public         heap r       postgres    false            �            1259    25034    tasks_task_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.tasks_task_id_seq;
       public               postgres    false    219            :           0    0    tasks_task_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;
          public               postgres    false    218            �            1259    25005    users    TABLE     �  CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_email character varying(255) NOT NULL,
    user_name character varying(100) NOT NULL,
    user_designation character varying(50),
    user_gender character varying(10),
    user_phone_number bigint,
    user_password character varying(255) NOT NULL,
    CONSTRAINT users_user_gender_check CHECK (((user_gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    25004    users_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public               postgres    false    215            ;           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
          public               postgres    false    214            }           2604    25022    events event_id    DEFAULT     r   ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);
 >   ALTER TABLE public.events ALTER COLUMN event_id DROP DEFAULT;
       public               postgres    false    217    216    217                       2604    25085    post_tasks task_id    DEFAULT     x   ALTER TABLE ONLY public.post_tasks ALTER COLUMN task_id SET DEFAULT nextval('public.post_tasks_task_id_seq'::regclass);
 A   ALTER TABLE public.post_tasks ALTER COLUMN task_id DROP DEFAULT;
       public               postgres    false    222    223    223            ~           2604    25038    tasks task_id    DEFAULT     n   ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);
 <   ALTER TABLE public.tasks ALTER COLUMN task_id DROP DEFAULT;
       public               postgres    false    218    219    219            |           2604    25008    users user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public               postgres    false    215    214    215            /          0    25066    completed_tasks 
   TABLE DATA           T   COPY public.completed_tasks (task_description, task_assignee, event_id) FROM stdin;
    public               postgres    false    221   �=       +          0    25019    events 
   TABLE DATA           �   COPY public.events (event_id, event_name, event_organiser, event_date, event_time, event_location, event_participants, event_status) FROM stdin;
    public               postgres    false    217   �=       .          0    25054    events_completed 
   TABLE DATA           �   COPY public.events_completed (event_id, event_name, event_organiser, event_date_completed, event_location, event_participants) FROM stdin;
    public               postgres    false    220   �>       1          0    25082 
   post_tasks 
   TABLE DATA           X   COPY public.post_tasks (task_id, task_description, event_id, task_deadline) FROM stdin;
    public               postgres    false    223   @?       -          0    25035    tasks 
   TABLE DATA           }   COPY public.tasks (task_id, task_description, task_assignee, event_id, task_status, task_remarks, task_deadline) FROM stdin;
    public               postgres    false    219   �?       )          0    25005    users 
   TABLE DATA           �   COPY public.users (user_id, user_email, user_name, user_designation, user_gender, user_phone_number, user_password) FROM stdin;
    public               postgres    false    215   �@       <           0    0    events_event_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.events_event_id_seq', 15, true);
          public               postgres    false    216            =           0    0    post_tasks_task_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.post_tasks_task_id_seq', 6, true);
          public               postgres    false    222            >           0    0    tasks_task_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.tasks_task_id_seq', 20, true);
          public               postgres    false    218            ?           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 11, true);
          public               postgres    false    214            �           2606    25070 $   completed_tasks completed_tasks_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_pkey PRIMARY KEY (task_assignee);
 N   ALTER TABLE ONLY public.completed_tasks DROP CONSTRAINT completed_tasks_pkey;
       public                 postgres    false    221            �           2606    25060 &   events_completed events_completed_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.events_completed
    ADD CONSTRAINT events_completed_pkey PRIMARY KEY (event_id);
 P   ALTER TABLE ONLY public.events_completed DROP CONSTRAINT events_completed_pkey;
       public                 postgres    false    220            �           2606    25027    events events_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);
 <   ALTER TABLE ONLY public.events DROP CONSTRAINT events_pkey;
       public                 postgres    false    217            �           2606    25087    post_tasks post_tasks_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.post_tasks
    ADD CONSTRAINT post_tasks_pkey PRIMARY KEY (task_id);
 D   ALTER TABLE ONLY public.post_tasks DROP CONSTRAINT post_tasks_pkey;
       public                 postgres    false    223            �           2606    25043    tasks tasks_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);
 :   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_pkey;
       public                 postgres    false    219            �           2606    25013    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    215            �           2606    25015    users users_user_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_email_key UNIQUE (user_email);
 D   ALTER TABLE ONLY public.users DROP CONSTRAINT users_user_email_key;
       public                 postgres    false    215            �           2606    25017 !   users users_user_phone_number_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_phone_number_key UNIQUE (user_phone_number);
 K   ALTER TABLE ONLY public.users DROP CONSTRAINT users_user_phone_number_key;
       public                 postgres    false    215            �           2606    25076 -   completed_tasks completed_tasks_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.completed_tasks DROP CONSTRAINT completed_tasks_event_id_fkey;
       public               postgres    false    3210    217    221            �           2606    25071 2   completed_tasks completed_tasks_task_assignee_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_task_assignee_fkey FOREIGN KEY (task_assignee) REFERENCES public.users(user_id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.completed_tasks DROP CONSTRAINT completed_tasks_task_assignee_fkey;
       public               postgres    false    215    221    3204            �           2606    25061 6   events_completed events_completed_event_organiser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.events_completed
    ADD CONSTRAINT events_completed_event_organiser_fkey FOREIGN KEY (event_organiser) REFERENCES public.users(user_id) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public.events_completed DROP CONSTRAINT events_completed_event_organiser_fkey;
       public               postgres    false    215    220    3204            �           2606    25028 "   events events_event_organiser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_event_organiser_fkey FOREIGN KEY (event_organiser) REFERENCES public.users(user_id) ON DELETE CASCADE;
 L   ALTER TABLE ONLY public.events DROP CONSTRAINT events_event_organiser_fkey;
       public               postgres    false    217    215    3204            �           2606    25088 #   post_tasks post_tasks_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.post_tasks
    ADD CONSTRAINT post_tasks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.post_tasks DROP CONSTRAINT post_tasks_event_id_fkey;
       public               postgres    false    223    217    3210            �           2606    25049    tasks tasks_event_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_event_id_fkey;
       public               postgres    false    217    3210    219            �           2606    25044    tasks tasks_task_assignee_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_task_assignee_fkey FOREIGN KEY (task_assignee) REFERENCES public.users(user_id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_task_assignee_fkey;
       public               postgres    false    219    3204    215            /      x�+I-.	I,�642�4�4����� H?      +   z   x�3�t�T�/�.��/�4�4202�50�52�4��26�20��-�MJ�䬶�14�1����K���K�2�t�O2<��K2��8�pX���pJ�KO�)-*��c�c�0$F��� :�#$      .   �   x�]���0���+��b���ڽ��n�Ly������R��˙9�w2pxw�hd �P	�	�p�ad�G�� ���~H@�MYE����;t��$4QE%M����y��|�3�����n���B7��0*�4SY���7���B��P��b�ks=��k=��S9�˖�1�J�      1   1   x�3�,I-.I+��M/���34�5�54�4�4202�50�52����� ��
	      -     x�]��j�0E��W̦�&XR��:�M	��a)��-i\�~�.nҢݠs�1�r�P9��\�>T�\&@��Ѕ.�Zh-�F|t�Yx�K�t�jO�ϔ�gO>�)�-�!�*��E&�>��R���Wp�n깦�V���}l��q�{~�F��%u��r5�����.��j+���L���H)�l��S��j'W�\���S�o������&��?��x�2`���6�|��O`cp˻�J��Ȟp�M�E߁k�s�C�^�؄W>�3��%H�˻�!���RJ����x      )   p  x�u��n�0���p՞��7�F��(J��zY%+p06��6o_����'�o���z�Г닪E��ɴp�Q�c��EأƊ�?A��W�E��gP�s�<IY
h/�N�.��N�d�	��-9Y���&z�s� �'}EqA�c����÷��ި���P)Ե�'ǖ0ʑ�aO*��
���ë�nP=�����M����
,փ�Т����]�����m9�b�\�548�dM����)�j���1��z*�a��:lVh0���J|s+��n� +�)҄��Y-i|8�ǡ�}�+�&3�~�AW�����o8�
޵����(���վƒi�4F��~H;쌱�����|��~��尐߂1�W��Z     