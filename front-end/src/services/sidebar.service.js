import {LayoutDashboard,ShoppingBasket,ReceiptText,PackageOpen,Boxes,NotebookPen,ChartColumnBig,Container,Settings,LogOut} from "lucide-react"

export const sidebarService = [
    {
        id: 1,
        name: "Dashboard",
        icon: LayoutDashboard
    },
    {
        id: 2,
        name: "Sales",
        icon: ShoppingBasket
    },
    {
        id: 3,
        name: "Orders",
        icon: ReceiptText
    },
    {
        id: 4,
        name:"stock",
        icon: PackageOpen
    },
    {
        id: 5,
        name: "inventory",
        icon: Boxes
    },
    {
        id: 6,
        name: "Reports",
        icon: NotebookPen
    },
    {
        id: 7,
        name: "Statistics",
        icon: ChartColumnBig
    },
    {
        id: 8,
        name: "Suppliers",
        icon: Container
    },
    {
        id: 9,
        name: "Settings",
        icon: Settings
    },
    {
        id: 10,
        name: "Logout",
        icon: LogOut
    }
]