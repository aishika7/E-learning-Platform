export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: Array<'admin' | 'instructor' | 'student'>;
}

export const NAV_CONFIG: NavItem[] = [
  // Admin items
  { label: 'Dashboard',       icon: 'dashboard',    route: '/app/admin/dashboard',    roles: ['admin'] },
  { label: 'User Management', icon: 'group',        route: '/app/admin/users',        roles: ['admin'] },
  { label: 'All Courses',     icon: 'menu_book',    route: '/app/admin/courses',      roles: ['admin'] },
  { label: 'Analytics',       icon: 'bar_chart',    route: '/app/admin/analytics',    roles: ['admin'] },

  // Instructor items
  { label: 'Dashboard',       icon: 'dashboard',    route: '/app/instructor/dashboard', roles: ['instructor'] },
  { label: 'My Courses',      icon: 'menu_book',    route: '/app/instructor/courses',   roles: ['instructor'] },
  { label: 'Create Course',   icon: 'add_circle',   route: '/app/instructor/courses/new', roles: ['instructor'] },
  { label: 'Students',        icon: 'people',       route: '/app/instructor/students',  roles: ['instructor'] },

  // Student items
  { label: 'Dashboard',       icon: 'dashboard',    route: '/app/student/dashboard',  roles: ['student'] },
  { label: 'My Courses',      icon: 'school',       route: '/app/student/my-courses', roles: ['student'] },
  { label: 'Browse Courses',  icon: 'explore',      route: '/courses',                roles: ['student'] },
  { label: 'Profile',         icon: 'person',       route: '/app/student/profile',    roles: ['student'] },
];
