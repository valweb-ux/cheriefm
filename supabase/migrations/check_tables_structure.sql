-- Цей скрипт перевіряє структуру таблиць і виводить інформацію про стовпці
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable 
FROM 
    information_schema.columns 
WHERE 
    table_name IN ('tracks', 'artists') 
ORDER BY 
    table_name, 
    ordinal_position;

