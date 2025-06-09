import {LayoutDashboard,ShoppingBasket,ShoppingCart, ReceiptText,PackageOpen,Boxes,NotebookPen,ChartColumnBig,Container,Settings,LogOut} from "lucide-react"

export const sidebarService = [
    {
        id: 1,
        name: "Accueil",
        icon: LayoutDashboard,
        link:"dashboard"
    },
    {
        id: 2,
        name: "Commandes",
        icon: ShoppingCart,
        link:"orders"
    },
    {
        id: 1,
        name: "Ventes",
        icon: ReceiptText,
        link:"sales"
    },
    
    {
        id: 4,
        name:"Stocks",
        icon: PackageOpen,
        link:"stocks"
    },
    {
        id: 5,
        name: "Inventaire",
        icon: Boxes,
        link:"inventory"
    },
    {
        id: 6,
        name: "Statistiques",
        icon: ChartColumnBig,
        link:"statistics"
    },
    {
        id: 7,
        name: "Fournisseurs",
        icon: Container,
        link:"suppliers"
    },
     {
        id: 8,
        name: "Rapports",
        icon: NotebookPen,
        link:"reports"
    },
    {
        id: 9,
        name: "Reglages",
        icon: Settings,
        link:"settings"
    },
    {
        id: 10,
        name: "Déconnexion",
        icon: LogOut,
        link:"logout"
    }
]