interface ChatPreviewProps {
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  onClick: () => void;
}

const ChatPreview = ({ name, avatar, lastMessage, time, unread, onClick }: ChatPreviewProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted/50 active:bg-muted"
    >
      <div className="relative shrink-0">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-sage"
        />
        {unread && (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent ring-2 ring-background" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-semibold ${unread ? "text-foreground" : "text-foreground/80"}`}>
            {name}
          </span>
          <span className="text-[11px] text-muted-foreground">{time}</span>
        </div>
        <p className={`mt-0.5 truncate text-xs ${unread ? "font-medium text-foreground/70" : "text-muted-foreground"}`}>
          {lastMessage}
        </p>
      </div>
    </button>
  );
};

export default ChatPreview;
