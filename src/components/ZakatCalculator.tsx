/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, Scale, Heart, Coins, CheckCircle, Info } from 'lucide-react';
import { getTranslation } from '../translations';

interface ZakatCalculatorProps {
  currentLang: string;
  onPayZakat: (amount: number, category: string) => void;
  langPack: any;
}

export default function ZakatCalculator({ currentLang, onPayZakat, langPack }: ZakatCalculatorProps) {
  const [hargaEmas, setHargaEmas] = useState<number>(1425000); // Standard IDR per gram in 2026
  const [income, setIncome] = useState<string>('7500000');
  const [bonus, setBonus] = useState<string>('1500000');
  const [debt, setDebt] = useState<string>('1000000');
  
  const [savings, setSavings] = useState<string>('5000000');
  const [goldGrams, setGoldGrams] = useState<string>('10');
  const [businessAssets, setBusinessAssets] = useState<string>('0');

  const [activeTab, setActiveTab] = useState<'income' | 'wealth'>('income');

  // Calculates Nisab based on Gold price
  const yearlyNisab = hargaEmas * 85; 
  const monthlyNisab = yearlyNisab / 12;

  // Calculators results
  const [isNisabMet, setIsNisabMet] = useState<boolean>(false);
  const [totalZakat, setTotalZakat] = useState<number>(0);
  const [nettSubjectToZakat, setNettSubjectToZakat] = useState<number>(0);

  const t = (text: string) => getTranslation(text, currentLang);

  useEffect(() => {
    if (activeTab === 'income') {
      const incVal = Number(income) || 0;
      const bonVal = Number(bonus) || 0;
      const debtVal = Number(debt) || 0;

      const nett = (incVal + bonVal) - debtVal;
      setNettSubjectToZakat(nett);

      if (nett >= monthlyNisab) {
        setIsNisabMet(true);
        setTotalZakat(Math.max(0, nett * 0.025));
      } else {
        setIsNisabMet(false);
        setTotalZakat(0);
      }
    } else {
      const saveVal = Number(savings) || 0;
      const goldVal = (Number(goldGrams) || 0) * hargaEmas;
      const bizVal = Number(businessAssets) || 0;

      const compWealth = saveVal + goldVal + bizVal;
      setNettSubjectToZakat(compWealth);

      if (compWealth >= yearlyNisab) {
        setIsNisabMet(true);
        setTotalZakat(Math.max(0, compWealth * 0.025));
      } else {
        setIsNisabMet(false);
        setTotalZakat(0);
      }
    }
  }, [income, bonus, debt, savings, goldGrams, businessAssets, hargaEmas, activeTab, monthlyNisab, yearlyNisab]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const currentYearNisabFormated = formatCurrency(yearlyNisab);
  const currentMonthNisabFormated = formatCurrency(monthlyNisab);

  // Sharia intentions text (Niat) for Zakat
  const niatTexts = {
    income: {
      arabic: 'نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلَّهِ تَعَالَى',
      transliteration: 'Nawaitu an ukhrija zakaata maali fardhan lillaahi Ta\'ala',
      translate: t("Saya niat mengeluarkan zakat dari penghasilan saya, fardu karena Allah Ta'ala.")
    },
    wealth: {
      arabic: 'نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلَّهِ تَعَالَى',
      transliteration: 'Nawaitu an ukhrija zakaata maali fardhan lillaahi Ta\'ala',
      translate: t("Saya niat mengeluarkan zakat atas harta simpanan/keuntungan dagang saya, fardu karena Allah Ta'ala.")
    }
  };

  return (
    <div id="zakat-calculator" className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 md:p-10 animate-in fade-in duration-200">
      {/* Icon and title header */}
      <div className="flex items-center gap-3.5 border-b border-gray-100 dark:border-gray-700 pb-5 mb-6">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
          <Calculator className="w-6.5 h-6.5" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
            {t('Kalkulator Zakat Syariah')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {t('Hitung otomatis zakat sesuai fatwa syariah MUI.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* INPUT PANEL Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Pricing Gold Reference Slider with beautiful glass effect */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-3.5 flex flex-wrap sm:flex-nowrap items-center gap-3.5">
              <div className="shrink-0 p-2 bg-amber-100/60 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                <Coins className="w-4.5 h-4.5" />
              </div>
              <div className="grow">
                <label className="block text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                  {t('Referensi Harga Emas Saat Ini (IDR / Gram)')}
                </label>
                <input 
                  type="range" 
                  min="1200000" 
                  max="1800000" 
                  step="10000"
                  value={hargaEmas} 
                  onChange={(e) => setHargaEmas(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-0.5">
                  <span>Rp1.200.000</span>
                  <span className="bg-amber-100 dark:bg-amber-900 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200 text-[10px]">
                    {formatCurrency(hargaEmas)} / g
                  </span>
                  <span>Rp1.800.000</span>
                </div>
              </div>
            </div>

            {/* Tab Selectors */}
            <div className="grid grid-cols-2 gap-1.5 bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl">
              <button
                id="btn-zakat-salary"
                onClick={() => setActiveTab('income')}
                type="button"
                className={`py-2.5 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'income'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                {t('Zakat Penghasilan')}
              </button>
              <button
                id="btn-zakat-wealth"
                onClick={() => setActiveTab('wealth')}
                type="button"
                className={`py-2.5 px-3 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'wealth'
                    ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                {t('Zakat Tabungan / Maal')}
              </button>
            </div>

            <div className="space-y-4">
              {activeTab === 'income' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('Penghasilan Bulanan')}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-[10px]">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="block w-full pl-7 pr-2.5 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                        placeholder="7500000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('Bonus / Pendapatan Lain')}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-[10px]">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={bonus}
                        onChange={(e) => setBonus(e.target.value)}
                        className="block w-full pl-7 pr-2.5 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('Hutang / Cicilan Pokok')}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-[10px]">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={debt}
                        onChange={(e) => setDebt(e.target.value)}
                        className="block w-full pl-7 pr-2.5 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('Saldo Tabungan')}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-[10px]">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={savings}
                        onChange={(e) => setSavings(e.target.value)}
                        className="block w-full pl-7 pr-2.5 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('Emas Batangan (Gram)')}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        value={goldGrams}
                        onChange={(e) => setGoldGrams(e.target.value)}
                        className="block w-full pr-8 pl-2.5 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-[10px]">Gram</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                      {t('Aset Bisnis / Dagang')}
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-[10px]">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={businessAssets}
                        onChange={(e) => setBusinessAssets(e.target.value)}
                        className="block w-full pl-7 pr-2.5 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-xs focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'income' ? (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 -mt-2 leading-normal">
                  * {t('Khusus utang primer jatuh tempo pada bulan pencarian dana.')}
                </p>
              ) : goldGrams && Number(goldGrams) > 0 ? (
                <p className="text-[10px] text-amber-600 font-bold -mt-2">
                  {t('Setara nominal:')} {formatCurrency(Number(goldGrams) * hargaEmas)}
                </p>
              ) : null}
            </div>
          </div>

          {/* Sharia Rule details box */}
          <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-1.5 mt-auto">
            <div className="flex items-center gap-1.5 font-bold text-gray-700 dark:text-gray-300 mb-0.5">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              {t('Ketentuan Nisab Syariat')}
            </div>
            {activeTab === 'income' ? (
              <p className="leading-relaxed">
                {t('Nisab Zakat Profesi bulanan setara harga **522 kg makanan pokok/beras** atau setara **85 Gram Emas per tahun dibagi 12 bulan** (sekitar')} <strong className="text-emerald-700 dark:text-emerald-400">{currentMonthNisabFormated}</strong> {t('per bulan). Jika pendapatan bersih bersisa di atas nisab wajib menyisihkan 2,5% zakat.')}
              </p>
            ) : (
              <p className="leading-relaxed">
                {t('Nisab Zakat Maal/Tabungan tahunan setara harga **85 Gram Emas** (sekitar')} <strong className="text-emerald-700 dark:text-emerald-400">{currentYearNisabFormated}</strong> {t('). Jika total aset mengendap setahun melampaui nisab wajib mengeluarkan zakat tabungan 2,5%.')}
              </p>
            )}
          </div>
        </div>

        {/* RESULTS PANEL Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-slate-900 rounded-2xl p-5 md:p-6 border border-emerald-100/50 dark:border-emerald-900/30 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 border-b border-emerald-100 dark:border-emerald-900/50 pb-2">
              {t('Refraksi Hasil Perhitungan')}
            </h4>

            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block max-w-[200px]">
                {activeTab === 'income' ? t('Penghasilan Bersih Wajib Zakat') : t('Harta Bersih Wajib Zakat')}
              </span>
              <span className="text-sm font-bold text-gray-800 dark:text-white">{formatCurrency(nettSubjectToZakat)}</span>
            </div>

            {/* Tab Nisab evaluation */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-emerald-100/30">
              <span className="text-xs text-gray-500 dark:text-gray-300 font-semibold">{t('Apakah Nisab Terpenuhi?')}</span>
              {isNisabMet ? (
                <span className="bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {t('YA (Wajib Zakat)')}
                </span>
              ) : (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> {t('TIDAK (Belum Wajib)')}
                </span>
              )}
            </div>

            {/* Total due cash */}
            <div className="bg-emerald-600 dark:bg-emerald-800 rounded-xl p-4 md:p-5 text-white flex flex-col justify-center shadow-md">
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-black">{t('Total Zakat yang Harus Ditunaikan')}</span>
              <span className="text-2xl md:text-3xl font-black tracking-tight mt-1">{formatCurrency(totalZakat)}</span>
            </div>

            {/* Intention Recitation Panel */}
            {isNisabMet && totalZakat > 0 && (
              <div id="zakat-niat-panel" className="bg-emerald-50/70 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-lg p-3 space-y-1.5 mt-2 text-[11px]">
                <span className="font-bold text-emerald-850 dark:text-emerald-400 block flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  {t('Teks Niat Zakat (Sharia Intention)')}:
                </span>
                <p className="font-serif italic text-right text-gray-900 dark:text-emerald-200 text-xs leading-relaxed tracking-wider">
                  {activeTab === 'income' ? niatTexts.income.arabic : niatTexts.wealth.arabic}
                </p>
                <p className="text-[9px] text-gray-650 dark:text-emerald-400 leading-relaxed font-semibold italic">
                  "{activeTab === 'income' ? niatTexts.income.transliteration : niatTexts.wealth.transliteration}"
                </p>
                <p className="text-[9px] text-gray-500 dark:text-gray-300 leading-normal">
                  {t('Artinya:')} {activeTab === 'income' ? niatTexts.income.translate : niatTexts.wealth.translate}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-100/50 dark:border-emerald-900/50">
            {totalZakat > 0 ? (
              <button
                id="btn-confirm-pay-zakat"
                onClick={() => onPayZakat(totalZakat, activeTab === 'income' ? 'Zakat Penghasilan' : 'Zakat Maal')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                {t('Tunaikan Zakat Sekarang')}
              </button>
            ) : (
              <button
                id="btn-disclaimer-sedekah"
                onClick={() => onPayZakat(100000, 'Sedekah / Infaq Sukarela')}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-bold py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                {t('Tunaikan Sedekah Alternatif (Tanpa Nisab)')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
