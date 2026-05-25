import pandas as pd

# Cargar el archivo original
file_path = 'erro code - sheet1.csv'
df = pd.read_csv(file_path)

# Mostrar las columnas originales para verificar nombres exactos
print("Columnas originales:", df.columns.tolist())

# Seleccionar las columnas solicitadas
# Nota: Según la cabecera, es 'Error Code' sin punto final, 'Description Eng.', 'Description Chn.' y 'Responsible Dept.'
columnas_interes = ['Error Code', 'Description Eng.', 'Description Chn.', 'Responsible Dept.']

# Filtrar el dataframe con estas columnas
df_filtrado = df[columnas_interes].copy()

# Renombrar 'Description Chn.' a 'Description Esp.' como se solicitó
df_filtrado = df_filtrado.rename(columns={'Description Chn.': 'Description Esp.'})

# Guardar el nuevo dataframe como CSV para la base de datos de la app
output_file = 'error_codes_database.csv'
df_filtrado.to_csv(output_file, index=False, encoding='utf-8')
print(f"Archivo guardado exitosamente como: {output_file}")
print(df_filtrado.head())



