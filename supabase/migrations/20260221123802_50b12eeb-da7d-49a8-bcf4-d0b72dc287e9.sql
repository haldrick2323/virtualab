-- Add validation trigger for video_url on teacher_topics (using trigger instead of CHECK for flexibility)
CREATE OR REPLACE FUNCTION public.validate_video_url()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.video_url IS NOT NULL AND NEW.video_url !~* '^https://(www\.)?(youtube\.com|youtu\.be)/' THEN
    RAISE EXCEPTION 'video_url must be a valid YouTube URL (https://youtube.com or https://youtu.be)';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_teacher_topics_video_url
BEFORE INSERT OR UPDATE ON public.teacher_topics
FOR EACH ROW
EXECUTE FUNCTION public.validate_video_url();