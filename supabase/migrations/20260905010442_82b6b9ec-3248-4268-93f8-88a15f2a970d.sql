-- ===== Roles =====
CREATE TYPE public.app_role AS ENUM ('super_admin','content_admin','training_admin','support_admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;
CREATE OR REPLACE FUNCTION public.can_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','content_admin'))
$$;
CREATE OR REPLACE FUNCTION public.can_training(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','training_admin'))
$$;
CREATE OR REPLACE FUNCTION public.can_support(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','support_admin'))
$$;

CREATE POLICY "roles: read own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "roles: super manages" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- ===== updated_at helper =====
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ===== Profiles =====
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  university text NOT NULL DEFAULT '',
  study_year text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  last_active_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles: read own or admin" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "profiles: insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles: update own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid() AND status = (SELECT p.status FROM public.profiles p WHERE p.id = auth.uid()));
CREATE POLICY "profiles: support manages" ON public.profiles FOR ALL TO authenticated USING (public.can_support(auth.uid())) WITH CHECK (public.can_support(auth.uid()));
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== Pharmacies & Training =====
CREATE TABLE public.pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  contact_person text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  working_hours text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pharmacies TO authenticated;
GRANT ALL ON public.pharmacies TO service_role;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pharmacies: read" ON public.pharmacies FOR SELECT TO authenticated USING (status = 'active' OR public.is_admin(auth.uid()));
CREATE POLICY "pharmacies: training admin manages" ON public.pharmacies FOR ALL TO authenticated USING (public.can_training(auth.uid())) WITH CHECK (public.can_training(auth.uid()));
CREATE TRIGGER pharmacies_updated BEFORE UPDATE ON public.pharmacies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  pharmacy_id uuid REFERENCES public.pharmacies(id) ON DELETE SET NULL,
  seats integer NOT NULL DEFAULT 5,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'open',
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainings TO authenticated;
GRANT ALL ON public.trainings TO service_role;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trainings: read" ON public.trainings FOR SELECT TO authenticated USING (status <> 'cancelled' OR public.is_admin(auth.uid()));
CREATE POLICY "trainings: training admin manages" ON public.trainings FOR ALL TO authenticated USING (public.can_training(auth.uid())) WITH CHECK (public.can_training(auth.uid()));
CREATE TRIGGER trainings_updated BEFORE UPDATE ON public.trainings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.training_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id uuid NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (training_id, student_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.training_applications TO authenticated;
GRANT ALL ON public.training_applications TO service_role;
ALTER TABLE public.training_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apps: read own or admin" ON public.training_applications FOR SELECT TO authenticated USING (student_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "apps: student applies" ON public.training_applications FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid() AND status = 'pending');
CREATE POLICY "apps: training admin manages" ON public.training_applications FOR ALL TO authenticated USING (public.can_training(auth.uid())) WITH CHECK (public.can_training(auth.uid()));

-- ===== Education =====
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  cover_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT 'مبتدئ',
  instructor text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "courses: read" ON public.courses FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "courses: content admin manages" ON public.courses FOR ALL TO authenticated USING (public.can_content(auth.uid())) WITH CHECK (public.can_content(auth.uid()));
CREATE TRIGGER courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "modules: read" ON public.modules FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "modules: content admin manages" ON public.modules FOR ALL TO authenticated USING (public.can_content(auth.uid())) WITH CHECK (public.can_content(auth.uid()));

CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'text',
  content text NOT NULL DEFAULT '',
  media_url text NOT NULL DEFAULT '',
  minutes integer NOT NULL DEFAULT 10,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lessons: read" ON public.lessons FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "lessons: content admin manages" ON public.lessons FOR ALL TO authenticated USING (public.can_content(auth.uid())) WITH CHECK (public.can_content(auth.uid()));

CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  option_a text NOT NULL DEFAULT '',
  option_b text NOT NULL DEFAULT '',
  option_c text NOT NULL DEFAULT '',
  option_d text NOT NULL DEFAULT '',
  correct text NOT NULL DEFAULT 'A',
  explanation text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'متوسط',
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  module_id uuid REFERENCES public.modules(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions: read" ON public.questions FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "questions: content admin manages" ON public.questions FOR ALL TO authenticated USING (public.can_content(auth.uid())) WITH CHECK (public.can_content(auth.uid()));

CREATE TABLE public.clinical_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  patient_age text NOT NULL DEFAULT '',
  gender text NOT NULL DEFAULT '',
  symptoms text NOT NULL DEFAULT '',
  medical_history text NOT NULL DEFAULT '',
  diagnosis text NOT NULL DEFAULT '',
  prescription text NOT NULL DEFAULT '',
  questions text NOT NULL DEFAULT '',
  correct_answers text NOT NULL DEFAULT '',
  explanation text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'متوسط',
  category text NOT NULL DEFAULT '',
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  module_id uuid REFERENCES public.modules(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clinical_cases TO authenticated;
GRANT ALL ON public.clinical_cases TO service_role;
ALTER TABLE public.clinical_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cases: read" ON public.clinical_cases FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "cases: content admin manages" ON public.clinical_cases FOR ALL TO authenticated USING (public.can_content(auth.uid())) WITH CHECK (public.can_content(auth.uid()));

CREATE TABLE public.drugs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generic_name text NOT NULL,
  brand_names text[] NOT NULL DEFAULT '{}',
  drug_class text NOT NULL DEFAULT '',
  dosage_form text NOT NULL DEFAULT '',
  strength text NOT NULL DEFAULT '',
  indication text NOT NULL DEFAULT '',
  contraindications text NOT NULL DEFAULT '',
  side_effects text NOT NULL DEFAULT '',
  counseling_points text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drugs TO authenticated;
GRANT ALL ON public.drugs TO service_role;
ALTER TABLE public.drugs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drugs: read" ON public.drugs FOR SELECT TO authenticated USING (status = 'published' OR public.is_admin(auth.uid()));
CREATE POLICY "drugs: content admin manages" ON public.drugs FOR ALL TO authenticated USING (public.can_content(auth.uid())) WITH CHECK (public.can_content(auth.uid()));

-- ===== Student activity =====
CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress integer NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments: own or admin read" ON public.enrollments FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "enrollments: own write" ON public.enrollments FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_results TO authenticated;
GRANT ALL ON public.quiz_results TO service_role;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz: own or admin read" ON public.quiz_results FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "quiz: own insert" ON public.quiz_results FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT false,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "progress: own or admin read" ON public.lesson_progress FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "progress: own write" ON public.lesson_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  title text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_type, item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookmarks: own or admin read" ON public.bookmarks FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "bookmarks: own write" ON public.bookmarks FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "bookmarks: super admin delete" ON public.bookmarks FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin'));

-- ===== Notifications =====
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  target_type text NOT NULL DEFAULT 'all',
  target_id text NOT NULL DEFAULT '',
  scheduled_at timestamptz,
  status text NOT NULL DEFAULT 'sent',
  sent_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications: read" ON public.notifications FOR SELECT TO authenticated USING (status = 'sent' OR public.is_admin(auth.uid()));
CREATE POLICY "notifications: support manages" ON public.notifications FOR ALL TO authenticated USING (public.can_support(auth.uid())) WITH CHECK (public.can_support(auth.uid()));

-- ===== Content & Settings =====
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content: public read" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "content: super manages" ON public.site_content FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE TRIGGER site_content_updated BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_content (key, title, body) VALUES
 ('home','الصفحة الرئيسية','منصة Pharma Connect Libya تربط طلاب الصيدلة بالتدريب العملي والدورات التعليمية والصيدليات.'),
 ('about','من نحن','منصة ليبية لتأهيل طلاب الصيدلة عمليًا وعلميًا.'),
 ('faq','الأسئلة الشائعة','س: كيف أسجل في تدريب؟\nج: من صفحة الصيدليات اختر التدريب المتاح واضغط تقديم.'),
 ('terms','الشروط والأحكام','باستخدامك للمنصة فإنك توافق على الشروط التالية...'),
 ('privacy','سياسة الخصوصية','نحترم خصوصيتك ولا نشارك بياناتك مع أي طرف ثالث.'),
 ('contact','معلومات التواصل','البريد: info@pharmaconnect.ly\nالهاتف: +218 91 000 0000');

CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings: public read" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings: super manages" ON public.settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE TRIGGER settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.settings (key, value) VALUES
 ('general','{"platform_name":"Pharma Connect Libya","logo_url":"","contact_email":"info@pharmaconnect.ly","contact_phone":"+218 91 000 0000"}'),
 ('registration','{"allow_new_registrations":true,"require_email_verification":true}'),
 ('training','{"rules":"الالتزام بمواعيد الصيدلية والزي الرسمي.","max_students":5}'),
 ('notifications','{"email":true,"in_app":true}');

-- ===== Audit logs =====
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text NOT NULL DEFAULT '',
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL DEFAULT '',
  entity_label text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit: admins read" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.log_admin_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r jsonb; lbl text; rid text; em text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin(auth.uid()) THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  r := to_jsonb(COALESCE(NEW, OLD));
  lbl := COALESCE(r->>'title', r->>'name', r->>'generic_name', r->>'full_name', left(r->>'question', 80), r->>'key', '');
  rid := COALESCE(r->>'id', r->>'key', '');
  em := COALESCE(auth.jwt()->>'email', '');
  INSERT INTO public.audit_logs (actor_id, actor_email, action, entity_type, entity_id, entity_label)
  VALUES (auth.uid(), em, TG_OP, TG_TABLE_NAME, rid, lbl);
  RETURN COALESCE(NEW, OLD);
END; $$;

CREATE TRIGGER audit_profiles AFTER UPDATE OR DELETE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_pharmacies AFTER INSERT OR UPDATE OR DELETE ON public.pharmacies FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_trainings AFTER INSERT OR UPDATE OR DELETE ON public.trainings FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_courses AFTER INSERT OR UPDATE OR DELETE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_modules AFTER INSERT OR UPDATE OR DELETE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_lessons AFTER INSERT OR UPDATE OR DELETE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_questions AFTER INSERT OR UPDATE OR DELETE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_cases AFTER INSERT OR UPDATE OR DELETE ON public.clinical_cases FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_drugs AFTER INSERT OR UPDATE OR DELETE ON public.drugs FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_notifications AFTER INSERT OR UPDATE OR DELETE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_site_content AFTER UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_settings AFTER UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();

-- ===== Dashboard stats =====
CREATE OR REPLACE FUNCTION public.admin_stats() RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN jsonb_build_object(
    'students_total', (SELECT count(*) FROM profiles),
    'students_active', (SELECT count(*) FROM profiles WHERE status='active' AND last_active_at > now() - interval '30 days'),
    'students_new', (SELECT count(*) FROM profiles WHERE created_at > now() - interval '7 days'),
    'students_pending', (SELECT count(*) FROM profiles WHERE status IN ('pending','suspended')),
    'courses_total', (SELECT count(*) FROM courses),
    'courses_published', (SELECT count(*) FROM courses WHERE status='published'),
    'courses_draft', (SELECT count(*) FROM courses WHERE status='draft'),
    'trainings_total', (SELECT count(*) FROM trainings),
    'trainings_completed', (SELECT count(*) FROM trainings WHERE status='completed'),
    'pharmacies_total', (SELECT count(*) FROM pharmacies),
    'pharmacies_active', (SELECT count(*) FROM pharmacies WHERE status='active'),
    'applications_new', (SELECT count(*) FROM training_applications WHERE status='pending'),
    'lessons_total', (SELECT count(*) FROM lessons),
    'questions_total', (SELECT count(*) FROM questions),
    'cases_total', (SELECT count(*) FROM clinical_cases),
    'drugs_total', (SELECT count(*) FROM drugs),
    'enrollments_total', (SELECT count(*) FROM enrollments),
    'enrollments_completed', (SELECT count(*) FROM enrollments WHERE completed_at IS NOT NULL),
    'signups_by_day', (SELECT COALESCE(jsonb_agg(jsonb_build_object('d', d, 'n', n) ORDER BY d), '[]'::jsonb) FROM (SELECT date_trunc('day', created_at)::date AS d, count(*) AS n FROM profiles WHERE created_at > now() - interval '30 days' GROUP BY 1) s),
    'apps_by_day', (SELECT COALESCE(jsonb_agg(jsonb_build_object('d', d, 'n', n) ORDER BY d), '[]'::jsonb) FROM (SELECT date_trunc('day', created_at)::date AS d, count(*) AS n FROM training_applications WHERE created_at > now() - interval '30 days' GROUP BY 1) s),
    'completions_by_day', (SELECT COALESCE(jsonb_agg(jsonb_build_object('d', d, 'n', n) ORDER BY d), '[]'::jsonb) FROM (SELECT date_trunc('day', completed_at)::date AS d, count(*) AS n FROM enrollments WHERE completed_at > now() - interval '30 days' GROUP BY 1) s)
  );
END; $$;
REVOKE ALL ON FUNCTION public.admin_stats() FROM public;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated;