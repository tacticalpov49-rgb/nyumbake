import { ArrowLeft, MessageCircle, FileText, Mail, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do likes work?", a: "Free users get 5 likes per day. Upgrade to Premium for unlimited likes. Likes reset at midnight." },
  { q: "How do I edit my profile?", a: "Go to your Profile tab and tap the Edit button to update your photo, interests, and icebreaker." },
  { q: "What is an icebreaker?", a: "An icebreaker is a personal prompt that helps start conversations. It appears on your profile and in chats." },
  { q: "How do I report someone?", a: "Open their profile or chat, tap the menu icon, and select 'Report'. Our team reviews all reports within 24 hours." },
  { q: "Can I delete my account?", a: "Yes. Go to Settings > Privacy & Safety and scroll to the bottom to find the delete account option." },
];

const HelpSupport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="flex items-center gap-3 px-5 pb-4">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-2xl font-bold text-foreground">Help & Support</h1>
      </div>

      <div className="px-4 space-y-4">
        <div className="rounded-2xl bg-card shadow-[var(--shadow-card)] overflow-hidden">
          <p className="text-xs font-semibold text-muted-foreground p-4 pb-2">Frequently Asked Questions</p>
          <Accordion type="single" collapsible className="px-4 pb-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm font-medium text-foreground text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="rounded-2xl bg-card shadow-[var(--shadow-card)] overflow-hidden divide-y divide-border">
          <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage">
              <Mail className="h-4 w-4 text-sage-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Email Us</p>
              <p className="text-xs text-muted-foreground">support@circlemeet.app</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground/50" />
          </button>

          <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage">
              <MessageCircle className="h-4 w-4 text-sage-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Live Chat</p>
              <p className="text-xs text-muted-foreground">Available 9am - 6pm EAT</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground/50" />
          </button>

          <button className="flex w-full items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage">
              <FileText className="h-4 w-4 text-sage-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Terms & Privacy Policy</p>
              <p className="text-xs text-muted-foreground">Read our policies</p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground/50" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
