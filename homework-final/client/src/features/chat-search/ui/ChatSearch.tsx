import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/Input';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const ChatSearch = ({ value, onChange }: Props) => (
  <div className="relative">
    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Поиск по чатам и сообщениям" className="pl-10" />
  </div>
);
