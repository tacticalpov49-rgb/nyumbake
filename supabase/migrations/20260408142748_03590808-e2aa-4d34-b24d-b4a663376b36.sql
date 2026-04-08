
-- Trigger function for post likes
CREATE OR REPLACE FUNCTION public.notify_on_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_owner_id uuid;
BEGIN
  SELECT user_id INTO post_owner_id FROM public.posts WHERE id = NEW.post_id;
  
  IF post_owner_id IS NOT NULL AND post_owner_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, from_user_id, post_id, message)
    VALUES (post_owner_id, 'like', NEW.user_id, NEW.post_id, 'liked your post');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_liked
AFTER INSERT ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.notify_on_like();

-- Trigger function for post comments
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  post_owner_id uuid;
BEGIN
  SELECT user_id INTO post_owner_id FROM public.posts WHERE id = NEW.post_id;
  
  IF post_owner_id IS NOT NULL AND post_owner_id != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, from_user_id, post_id, message)
    VALUES (post_owner_id, 'comment', NEW.user_id, NEW.post_id, 'commented on your post');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_post_commented
AFTER INSERT ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();
