
import React from 'react';
import { Fungicide, Insecticide, PlotType } from '../types';

interface Plan {
    treatmentNumber: number;
    products: (Fungicide | Insecticide)[];
    uncoveredTargets: string[];
}

interface IntegratedSystemTableProps {
  plan: Plan[];
  plotType: PlotType;
}

const targetNameMap: Record<string, string> = {
    phytophthora: 'Пероноспороз/Фітофтороз',
    rots: 'Гнилі',
    bacteriosis: 'Бактеріози',
    lepidoptera: 'Лускокрилі',
    coleoptera: 'Твердокрилі',
    sucking: 'Сисні',
};

const IntegratedSystemTable: React.FC<IntegratedSystemTableProps> = ({ plan, plotType }) => {
    if (!plan || plan.length === 0) {
        return <p className="text-center text-gray-500 py-4">Не вдалося згенерувати план. Можливо, замалий вегетаційний період або недостатньо даних по препаратах.</p>
    }

  return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">№</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Препарати</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Норма</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Шкодочинні об'єкти</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {plan.map((treatment, index) => {
                    const coveredTargets = Object.keys(targetNameMap).filter(t => !treatment.uncoveredTargets.includes(t));
                    
                    return (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4 align-top whitespace-nowrap font-semibold text-gray-800">{treatment.treatmentNumber}</td>
                            <td className="px-4 py-4 align-top whitespace-nowrap">
                                {treatment.products.length > 0 ? (
                                    <ul className="space-y-1">
                                        {treatment.products.map(p => (
                                            <li key={`${p.productName}-${p.activeIngredient}`}>
                                                <span className="font-semibold">{p.productName}</span>
                                                <span className="text-gray-500 text-sm"> ({p.activeIngredient})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span className="text-gray-500">Немає рекомендацій</span>
                                )}
                            </td>
                            <td className="px-4 py-4 align-top whitespace-nowrap text-sm text-gray-700 font-semibold">
                                {treatment.products.length > 0 ? (
                                    <ul className="space-y-2">
                                        {treatment.products.map(p => {
                                            const rate = plotType === 'home' ? p.rateHome : p.rateField;
                                            return (
                                                <li key={`${p.productName}-rate`}>
                                                    {rate || 'Див. інструкцію'}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : '-'}
                            </td>
                            <td className="px-4 py-4 align-top">
                                <div className="flex flex-wrap gap-2 max-w-xs">
                                    {coveredTargets.map(target => (
                                        <span key={target} className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                            {targetNameMap[target]}
                                        </span>
                                    ))}
                                    {treatment.uncoveredTargets.length > 0 && treatment.uncoveredTargets.map(target => (
                                        <span key={target} className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full" title="Не знайдено ефективного препарату">
                                            {targetNameMap[target]}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
  );
};

export default IntegratedSystemTable;