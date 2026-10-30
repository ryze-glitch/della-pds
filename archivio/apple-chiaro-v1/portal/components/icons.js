import {
  ArrowLeft, ArrowRight, ArrowUpRight, AlertTriangle, Bell, Briefcase, Calendar, CalendarCheck, Car, Check, CheckCircle2,
  ChevronDown, ChevronRight, ClipboardList, Clock, Copy, Crown, Dog, ExternalLink, FileCheck, FileText, Fingerprint,
  Gavel, GraduationCap, Handshake, Headset, Info, Landmark, LayoutDashboard, Loader2, Lock, LogOut, Mail, MapPin,
  Medal, Megaphone, Menu, Monitor, Moon, Newspaper, Phone, Printer, Radio, Scale, Search, Send, Shield, ShieldCheck,
  Siren, Star, Stethoscope, Sun, User, Users, Wallet, X, XCircle, Building2,
} from 'lucide-react';

const MAP = {
  'arrow-left': ArrowLeft, 'arrow-right': ArrowRight, 'arrow-up-right': ArrowUpRight, alert: AlertTriangle, bell: Bell,
  briefcase: Briefcase, calendar: Calendar, 'calendar-check': CalendarCheck, car: Car, check: Check, 'check-circle': CheckCircle2,
  'chevron-down': ChevronDown, chevron: ChevronRight, clipboard: ClipboardList, clock: Clock, copy: Copy, crown: Crown,
  dog: Dog, external: ExternalLink, 'file-check': FileCheck, 'file-text': FileText, fingerprint: Fingerprint, gavel: Gavel,
  graduation: GraduationCap, handshake: Handshake, headset: Headset, info: Info, landmark: Landmark, dashboard: LayoutDashboard,
  loader: Loader2, lock: Lock, logout: LogOut, mail: Mail, pin: MapPin, medal: Medal, megaphone: Megaphone, menu: Menu,
  monitor: Monitor, moon: Moon, news: Newspaper, phone: Phone, printer: Printer, radio: Radio, scale: Scale, search: Search,
  send: Send, shield: Shield, 'shield-check': ShieldCheck, siren: Siren, star: Star, stethoscope: Stethoscope, sun: Sun,
  user: User, users: Users, wallet: Wallet, x: X, cross: XCircle, building: Building2,
};

export function Icon({ name, size = 20, className = '', strokeWidth = 2 }) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return <Cmp size={Math.round(size * 0.9)} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}
