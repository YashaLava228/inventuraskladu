export const initialItems = [
  // --- KRABICE A OBALY (палети - pal) ---
  { id: 'BOX-01', name: 'Krabice LOUIE 150g', category: 'boxes', weight: '150g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-02', name: 'Krabice LOUIE 300g', category: 'boxes', weight: '300g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-03', name: 'Krabice Ontario / Wild Balance 200g', category: 'boxes', weight: '200g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-04', name: 'Krabice Wild Balance 400g', category: 'boxes', weight: '400g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-05', name: 'Krabice Wild Balance 85g', category: 'boxes', weight: '85g', unit: 'pal', quantity: 10, minLimit: 2 },

  // --- LOUIE KAPSIČKY (коробки - krab) ---
  { id: 'LOU 15001', name: 'LOU 15001 | LOUIE kapsička kuřecí s cuketou 150 g', category: 'louie-kapsicky', weight: '150g', unit: 'krab', quantity: 50, minLimit: 10 },
  { id: 'LOU 15002', name: 'LOU 15002 | LOUIE kapsička kuřecí s cuketou 300 g', category: 'louie-kapsicky', weight: '300g', unit: 'krab', quantity: 50, minLimit: 10 },
  { id: 'LOU 15101', name: 'LOU 15101 | LOUIE kapsička hovězí s mrkví 150 g', category: 'louie-kapsicky', weight: '150g', unit: 'krab', quantity: 50, minLimit: 10 },
  { id: 'LOU 15102', name: 'LOU 15102 | LOUIE kapsička hovězí s mrkví 300 g', category: 'louie-kapsicky', weight: '300g', unit: 'krab', quantity: 50, minLimit: 10 },

  // --- LOUIE KONZERVA ETIKETY (баліки - bal) ---
  { id: 'LOU 11009', name: 'LOU 11009 | LOUIE Kuřecí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11010', name: 'LOU 11010 | LOUIE Kuřecí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11011', name: 'LOU 11011 | LOUIE Kuřecí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  
  { id: 'LOU 11019', name: 'LOU 11019 | LOUIE Hovězí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11020', name: 'LOU 11020 | LOUIE Hovězí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11021', name: 'LOU 11021 | LOUIE Hovězí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 11029', name: 'LOU 11029 | LOUIE Kachní s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11030', name: 'LOU 11030 | LOUIE Kachní s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11031', name: 'LOU 11031 | LOUIE Kachní s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 11039', name: 'LOU 11039 | LOUIE Rybí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11040', name: 'LOU 11040 | LOUIE Rybí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11041', name: 'LOU 11041 | LOUIE Rybí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 11049', name: 'LOU 11049 | LOUIE Krůtí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11050', name: 'LOU 11050 | LOUIE Krůtí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11051', name: 'LOU 11051 | LOUIE Krůtí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 12020', name: 'LOU 12020 | LOUIE Telecí s šípkem a batáty 400 g', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 13050', name: 'LOU 13050 | LOUIE Krůtí s lososem a kopřivou 400 g', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 13051', name: 'LOU 13051 | LOUIE Krůtí s lososem a kopřivou 800 g', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14009', name: 'LOU 14009 | LOUIE Kuřecí s cuketou 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14010', name: 'LOU 14010 | LOUIE Kuřecí s cuketou 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14011', name: 'LOU 14011 | LOUIE Kuřecí s cuketou 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14019', name: 'LOU 14019 | LOUIE Hovězí s mrkví 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14020', name: 'LOU 14020 | LOUIE Hovězí s mrkví 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14021', name: 'LOU 14021 | LOUIE Hovězí s mrkví 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14029', name: 'LOU 14029 | LOUIE Kachní s brusinkami 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14030', name: 'LOU 14030 | LOUIE Kachní s brusinkami 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14031', name: 'LOU 14031 | LOUIE Kachní s brusinkami 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14039', name: 'LOU 14039 | LOUIE Rybí s řasami 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14040', name: 'LOU 14040 | LOUIE Rybí s řasami 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14041', name: 'LOU 14041 | LOUIE Rybí s řasami 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  // --- ONTARIO ETIKETY (баліки - bal) ---
  { id: '214-859785', name: '214-859785 | Ontario Puppy kuřecí spirulína 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859792', name: '214-859792 | Ontario Adult hovězí spirulína 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859808', name: '214-859808 | Ontario Adult kuřecí borůvky 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859815', name: '214-859815 | Ontario Adult jehněčí rakytník 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859822', name: '214-859822 | Ontario Adult kachní brusinky 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859839', name: '214-859839 | Ontario Adult telecí kurkuma 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  
  { id: '214-859846', name: '214-859846 | Ontario Puppy kuřecí spirulína 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859853', name: '214-859853 | Ontario Adult hovězí spirulína 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859860', name: '214-859860 | Ontario Adult kuřecí borůvky 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859877', name: '214-859877 | Ontario Adult jehněčí rakytník 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859884', name: '214-859884 | Ontario Adult kachní brusinky 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859891', name: '214-859891 | Ontario Adult telecí kurkuma 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: '214-859907', name: '214-859907 | Ontario Puppy kuřecí spirulína 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859914', name: '214-859914 | Ontario Adult hovězí spirulína 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859921', name: '214-859921 | Ontario Adult kuřecí borůvky 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859938', name: '214-859938 | Ontario Adult jehněčí rakytník 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859945', name: '214-859945 | Ontario Adult kachní brusinky 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859952', name: '214-859952 | Ontario Adult telecí kurkuma 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: '214-859969', name: '214-859969 | Ontario Puppy monoprotein krůtí mrkev 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859976', name: '214-859976 | Ontario Adult monoprotein krůtí batáty 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859983', name: '214-859983 | Ontario Adult monoprotein jehněčí rýže 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859990', name: '214-859990 | Ontario Adult monoprotein hovězí mrkev 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860002', name: '214-860002 | Ontario Adult monoprotein kachní dýně 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  
  { id: '214-860019', name: '214-860019 | Ontario Puppy monoprotein krůtí mrkev 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860026', name: '214-860026 | Ontario Adult monoprotein krůtí batáty 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860033', name: '214-860033 | Ontario Adult monoprotein jehněčí rýže 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860040', name: '214-860040 | Ontario Adult monoprotein hovězí mrkev 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860057', name: '214-860057 | Ontario Adult monoprotein kachní dýně 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },

  // --- OSTATNÍ / TECHNICKÝ MATERIÁL (інше) ---
  { id: 'MAT-01', name: 'Lepidlo', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 10, minLimit: 2 },
  { id: 'MAT-02', name: 'Inkoust', category: 'ostatni', weight: 'N/A', unit: '%', quantity: 100, minLimit: 70 },
  { id: 'MAT-03', name: 'Plyn - Zásobník 1', category: 'ostatni', weight: 'N/A', unit: '%', quantity: 100, minLimit: 20 },
  { id: 'MAT-04', name: 'Plyn - Zásobník 2', category: 'ostatni', weight: 'N/A', unit: '%', quantity: 100, minLimit: 20 },
  { id: 'MAT-05', name: 'Europalety', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 50, minLimit: 10 },
  { id: 'MAT-06', name: 'Standardní palety', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 50, minLimit: 10 },
  { id: 'MAT-07', name: 'Fólie pro baličku', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 10, minLimit: 2 },
  { id: 'MAT-08', name: 'Ruční fólie', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 10, minLimit: 2 },
  { id: 'MAT-09', name: 'Sůl do autoklávu', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 20, minLimit: 5 }
];
