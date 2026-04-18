import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, DollarSign, Package } from 'lucide-react';
import {
  getSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  getUserSubscriptions,
} from '../../services/adminApi';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'subscriptions'

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'plans') {
        const data = await getSubscriptionPlans();
        setPlans(data);
      } else {
        const data = await getUserSubscriptions();
        setSubscriptions(data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (data) => {
    try {
      await createSubscriptionPlan(data);
      setCreateModal(false);
      loadData();
    } catch (err) {
      alert('Error creando plan: ' + err.message);
    }
  };

  const handleUpdatePlan = async (planId, data) => {
    try {
      await updateSubscriptionPlan(planId, data);
      setEditModal(null);
      loadData();
    } catch (err) {
      alert('Error actualizando plan: ' + err.message);
    }
  };

  const formatPrice = (cents, currency) => {
    const symbol = currency === 'USD' ? '$' : currency;
    return `${symbol}${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Suscripciones</h1>
        <p className="text-gray-600 mt-2">Gestiona planes de suscripción y usuarios suscritos</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'plans'
                ? 'border-mn-purple text-mn-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Package className="inline-block mr-2" size={18} />
            Planes
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === 'subscriptions'
                ? 'border-mn-purple text-mn-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <DollarSign className="inline-block mr-2" size={18} />
            Suscripciones Activas
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-mn-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      ) : activeTab === 'plans' ? (
        <PlansTab
          plans={plans}
          onCreateClick={() => setCreateModal(true)}
          onEditClick={(plan) => setEditModal(plan)}
          formatPrice={formatPrice}
        />
      ) : (
        <SubscriptionsTab subscriptions={subscriptions} formatPrice={formatPrice} />
      )}

      {/* Create Modal */}
      {createModal && (
        <Modal title="Crear Nuevo Plan" onClose={() => setCreateModal(false)}>
          <PlanForm
            onSave={handleCreatePlan}
            onCancel={() => setCreateModal(false)}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {editModal && (
        <Modal title="Editar Plan" onClose={() => setEditModal(null)}>
          <PlanForm
            plan={editModal}
            onSave={(data) => handleUpdatePlan(editModal.id, data)}
            onCancel={() => setEditModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}

// Plans Tab Component
function PlansTab({ plans, onCreateClick, onEditClick, formatPrice }) {
  return (
    <>
      <div className="mb-6 flex justify-end">
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90 transition-colors"
        >
          <Plus size={18} />
          Crear Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          No hay planes creados. Crea tu primer plan de suscripción.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                bg-white rounded-lg shadow-sm p-6 border-2 transition-all
                ${plan.isActive ? 'border-mn-purple' : 'border-gray-200 opacity-60'}
              `}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  {!plan.isActive && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                      Inactivo
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onEditClick(plan)}
                  className="text-gray-400 hover:text-mn-purple"
                >
                  <Edit size={18} />
                </button>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-mn-purple">
                  {formatPrice(plan.priceCents, plan.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  por {plan.interval === 'month' ? 'mes' : 'año'}
                </div>
              </div>

              {/* Description */}
              {plan.description && (
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              )}

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase">
                    Características:
                  </div>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stripe ID */}
              {plan.stripePriceId && (
                <div className="mt-4 pt-4 border-t text-xs text-gray-400">
                  Stripe: {plan.stripePriceId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Subscriptions Tab Component
function SubscriptionsTab({ subscriptions, formatPrice }) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
        No hay suscripciones activas
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{sub.userName || 'Sin nombre'}</div>
                <div className="text-sm text-gray-500">{sub.userEmail}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{sub.plan.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {formatPrice(sub.plan.priceCents, sub.plan.currency)}
              </td>
              <td className="px-6 py-4">
                <span className={`
                  inline-flex px-2 py-1 text-xs font-semibold rounded-full
                  ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                `}>
                  {sub.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {sub.currentPeriodEnd
                  ? `Hasta ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`
                  : '-'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Modal Component
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Plan Form Component
function PlanForm({ plan, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    description: plan?.description || '',
    priceCents: plan ? plan.priceCents : 0,
    currency: plan?.currency || 'USD',
    interval: plan?.interval || 'month',
    features: plan?.features || [],
    stripePriceId: plan?.stripePriceId || '',
    isActive: plan?.isActive !== undefined ? plan.isActive : true,
  });

  const [featureInput, setFeatureInput] = useState('');

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert('El nombre del plan es requerido');
      return;
    }
    if (formData.priceCents <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Plan *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            placeholder="Ej: Plan Premium"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            rows={3}
            placeholder="Describe el plan..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (en centavos) *
          </label>
          <input
            type="number"
            value={formData.priceCents}
            onChange={(e) => setFormData({ ...formData, priceCents: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            placeholder="9900"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ejemplo: 9900 = $99.00
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Moneda
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="MXN">MXN ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Intervalo
          </label>
          <select
            value={formData.interval}
            onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
          >
            <option value="month">Mensual</option>
            <option value="year">Anual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stripe Price ID
          </label>
          <input
            type="text"
            value={formData.stripePriceId}
            onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
            placeholder="price_..."
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Características
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mn-purple focus:border-transparent"
              placeholder="Escribe una característica..."
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {formData.features.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <span className="text-sm">{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-mn-purple rounded focus:ring-mn-purple"
            />
            <span className="text-sm font-medium text-gray-700">Plan activo</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 px-4 py-2 bg-mn-purple text-white rounded-lg hover:bg-mn-purple/90"
        >
          {plan ? 'Actualizar Plan' : 'Crear Plan'}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
