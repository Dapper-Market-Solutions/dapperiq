import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import LoginScreen from './components/LoginScreen'
import OrderForm from './components/OrderForm'
import OrderProgress from './components/OrderProgress'

export default function App() {
  const [step, setStep] = useState('login')
  const [clientConfig, setClientConfig] = useState(null)
  const [orders, setOrders] = useState([])

  function handleLogin(config) {
    setClientConfig(config)
    setStep('order')
  }

  function handleSubmitOrders(orderList) {
    setOrders(orderList)
    setStep('results')
  }

  function handleReset() {
    setStep('login')
    setClientConfig(null)
    setOrders([])
  }

  function handleNewOrder() {
    setOrders([])
    setStep('order')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-navy-50/40 flex flex-col">
      <Header
        clientName={clientConfig?.client_name}
        onLogoClick={handleReset}
      />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        {step === 'login' && (
          <LoginScreen onLogin={handleLogin} />
        )}
        {step === 'order' && clientConfig && (
          <OrderForm
            config={clientConfig}
            onSubmit={handleSubmitOrders}
            onBack={handleReset}
          />
        )}
        {step === 'results' && (
          <OrderProgress
            orders={orders}
            clientConfig={clientConfig}
            onNewOrder={handleNewOrder}
            onReset={handleReset}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
