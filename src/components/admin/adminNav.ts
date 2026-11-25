import type { ComponentType } from "react";
import {
  Activity,
  Boxes,
  FileText,
  FolderTree,
  HelpCircle,
  LayoutDashboard,
  type LucideProps,
  Megaphone,
  Package,
  Ruler,
  Search,
  Settings as SettingsIcon,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Tag,
  Tags,
  TrendingUp,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";

export type AdminNavLink = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
};
export type AdminNavGroup = { label: string; links: AdminNavLink[] };

export type AdminPermissions = {
  canCatalog: boolean;
  canOrders: boolean;
  canCustomers: boolean;
  canContent: boolean;
  canReports: boolean;
  canSettings: boolean;
  canUsers: boolean;
  canMaintenance: boolean;
};

const catalogLinks: AdminNavLink[] = [
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/attributes", label: "Attributes", icon: SlidersHorizontal },
  { href: "/admin/units", label: "Units", icon: Ruler },
  { href: "/admin/labels", label: "Labels", icon: Tags },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/questions", label: "Questions", icon: HelpCircle },
];

/** The admin sidebar/drawer sections the signed-in role may see. */
export function buildAdminNav(can: AdminPermissions): AdminNavGroup[] {
  const groups: (AdminNavGroup | false)[] = [
    {
      label: "Overview",
      links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
    },
    can.canOrders && {
      label: "Sales",
      links: [{ href: "/admin/orders", label: "Orders", icon: ShoppingCart }],
    },
    can.canCustomers && {
      label: "Customers",
      links: [{ href: "/admin/customers", label: "Customers", icon: Users }],
    },
    can.canCatalog && {
      label: "Catalog",
      links: [
        { href: "/admin/inventory", label: "Inventory", icon: Package },
        { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
        ...catalogLinks,
      ],
    },
    can.canReports && {
      label: "Insights",
      links: [
        { href: "/admin/reports", label: "Reports", icon: Activity },
        { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
      ],
    },
    can.canContent && {
      label: "Content",
      links: [{ href: "/admin/content", label: "Content", icon: FileText }],
    },
    can.canUsers && {
      label: "Team",
      links: [{ href: "/admin/users", label: "Users", icon: UserCog }],
    },
    can.canSettings && {
      label: "Settings",
      links: [
        { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
        { href: "/admin/tracking", label: "Tracking", icon: Activity },
        { href: "/admin/seo", label: "SEO", icon: Search },
      ],
    },
    can.canMaintenance && {
      label: "Maintenance",
      links: [{ href: "/admin/maintenance", label: "Maintenance", icon: Wrench }],
    },
  ];
  return groups.filter((group): group is AdminNavGroup => group !== false);
}

export function isActiveAdminLink(href: string, pathname: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
