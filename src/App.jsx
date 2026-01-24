// import React, { Suspense, useContext } from 'react'
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider, AuthContext } from './contexts/AuthContext'
// import { ThemeProvider } from './contexts/ThemeContext'
// import { DataProvider } from './contexts/DataContext'
// import Sidebar from './components/Sidebar'
// import Topbar from './components/Topbar'
// import { Toaster } from 'react-hot-toast'
// import { Skeleton } from './components/Skeleton'

// const Dashboard = React.lazy(() => import('./pages/Dashboard'))
// const Rooms = React.lazy(() => import('./pages/Rooms'))
// const Bookings = React.lazy(() => import('./pages/Bookings'))
// const Customers = React.lazy(() => import('./pages/Customers'))
// const Login = React.lazy(() => import('./pages/Login'))
// const Housekeeping = React.lazy(() => import('./pages/Housekeeping'))
// const UserDashboard = React.lazy(() => import('./user/UserDashboard'))
// const KitchenDashboard = React.lazy(() => import('./pages/KitchenDashboard'))





// function AppRoutes() {
//   const { user } = useContext(AuthContext)
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/user" />) : <Navigate to="/login" />} />
//       <Route path="/dashboard" element={user && user.role === 'admin' ? <DashboardLayout><Dashboard/></DashboardLayout> : <Navigate to="/login" />} />
//       <Route path="/rooms" element={user && user.role === 'admin' ? <DashboardLayout><Rooms/></DashboardLayout> : <Navigate to="/login" />} />
//       <Route path="/bookings" element={user && user.role === 'admin' ? <DashboardLayout><Bookings/></DashboardLayout> : <Navigate to="/login" />} />
//       <Route path="/customers" element={user && user.role === 'admin' ? <DashboardLayout><Customers/></DashboardLayout> : <Navigate to="/login" />} />
//       <Route path="/housekeeping" element={user && user.role === 'admin' ? <DashboardLayout><Housekeeping/></DashboardLayout> : <Navigate to="/login" />} />
//       <Route path="/user" element={user ? (user.role === 'user' ? <UserDashboard /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />} />
//       <Route
//   path="/kitchen"
//   element={
//     user && user.role === 'admin'
//       ? <DashboardLayout><KitchenDashboard /></DashboardLayout>
//       : <Navigate to="/login" />
//   }
// />


//     </Routes>
//   )
// }

// function DashboardLayout({ children }) {
//   return (
//     <div className="min-h-screen flex bg-background dark:bg-backgroundDark text-textPrimary dark:text-textPrimaryDark">
//       <Sidebar />
//       <div className="flex-1 ml-64">
//         <Topbar />
//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   )
// }


// export default function App() {
//   return (
//     <BrowserRouter>
//       <ThemeProvider>
//         <AuthProvider>
//           <DataProvider>
//             <Suspense fallback={<div className="p-6"><Skeleton className="h-6 w-48 mb-4"/><Skeleton className="h-6 w-full"/></div>}>
//               <AppRoutes />
//             </Suspense>
//             <Toaster position="top-right" />
//           </DataProvider>
//         </AuthProvider>
//       </ThemeProvider>
//     </BrowserRouter>
//   )
// }
import React, { Suspense, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { DataProvider } from './contexts/DataContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import { Toaster } from 'react-hot-toast'
import { Skeleton } from './components/Skeleton'

const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Rooms = React.lazy(() => import('./pages/Rooms'))
const Bookings = React.lazy(() => import('./pages/Bookings'))
const Customers = React.lazy(() => import('./pages/Customers'))
const Login = React.lazy(() => import('./pages/Login'))
const Housekeeping = React.lazy(() => import('./pages/Housekeeping'))
const UserDashboard = React.lazy(() => import('./user/UserDashboard'))
const KitchenDashboard = React.lazy(() => import('./pages/KitchenDashboard'))

function AppRoutes() {
  const { user } = useContext(AuthContext)

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          user
            ? user.role === 'admin'
              ? <Navigate to="/dashboard" />
              : <Navigate to="/user" />
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/dashboard"
        element={
          user && user.role === 'admin'
            ? <DashboardLayout><Dashboard /></DashboardLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/rooms"
        element={
          user && user.role === 'admin'
            ? <DashboardLayout><Rooms /></DashboardLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/bookings"
        element={
          user && user.role === 'admin'
            ? <DashboardLayout><Bookings /></DashboardLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/customers"
        element={
          user && user.role === 'admin'
            ? <DashboardLayout><Customers /></DashboardLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/housekeeping"
        element={
          user && user.role === 'admin'
            ? <DashboardLayout><Housekeeping /></DashboardLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/kitchen"
        element={
          user && user.role === 'admin'
            ? <DashboardLayout><KitchenDashboard /></DashboardLayout>
            : <Navigate to="/login" />
        }
      />

      <Route
        path="/user"
        element={
          user
            ? user.role === 'user'
              ? <UserDashboard />
              : <Navigate to="/dashboard" />
            : <Navigate to="/login" />
        }
      />
    </Routes>
  )
}

/* ✅ THIS IS WHERE BACKGROUND IS FIXED */
function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#f2f8f9] dark:bg-[#011425] text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}


export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <Suspense
              fallback={
                <div className="p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <Skeleton className="h-6 w-full" />
                </div>
              }
            >
              <AppRoutes />
            </Suspense>

            <Toaster position="top-right" />
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
