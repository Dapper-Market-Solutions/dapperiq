import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import WelcomeScreen from './components/WelcomeScreen'
import WelcomeScreenV2 from './components/WelcomeScreenV2'
import LoginScreen from './components/LoginScreen'
import ExploreScreen from './components/ExploreScreen'
import ExploreScreenV2 from './components/ExploreScreenV2'
import OrderForm from './components/OrderForm'
import OrderProgress from './components/OrderProgress'

const isClassic = new URLSearchParams(window.location.search).get('v') === 'classic'
const Welcome = isClassic ? WelcomeScreen : WelcomeScreenV2
const Explore = isClassic ? ExploreScreen : ExploreScreenV2

export default function App() {
  const [step, setStep] = useState('welcome')
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
    setStep('welcome')
    setClientConfig(null)
    setOrders([])
  }

  function handleNewOrder() {
    setOrders([])
    setStep('order')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        clientName={clientConfig?.client_name}
        onLogoClick={handleReset}
      />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
        {step === 'welcome' && (
          <Welcome
            onCurrentClient={() => setStep('login')}
            onExplore={() => setStep('explore')}
          />
        )}
        {step === 'login' && (
          <LoginScreen onLogin={handleLogin} onBack={() => setStep('welcome')} />
        )}
        {step === 'explore' && (
          <Explore onBack={() => setStep('welcome')} />
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
