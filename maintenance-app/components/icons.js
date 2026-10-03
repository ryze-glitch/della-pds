export function Icon({ name, className = '', filled = false }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined inline-block select-none leading-none ${filled ? 'icon-fill' : ''} ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}

export const ICON_NAMES =
  'arrow_back,arrow_forward,assignment_ind,brightness_auto,check_circle,chevron_right,close,dark_mode,dashboard,event,forum,groups,handshake,home,how_to_reg,light_mode,local_police,logout,menu,menu_book,mic,military_tech,newspaper,open_in_new,person,schedule,school,search,shield,support_agent,swap_horiz,theater_comedy,trending_up,workspace_premium';
