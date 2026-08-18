insert into public.brands (id,name,integration_type) values
('10000000-0000-0000-0000-000000000001','HAUL Studio','native'),
('10000000-0000-0000-0000-000000000002','Adidas','affiliate'),
('10000000-0000-0000-0000-000000000003','Reformation','native');

insert into public.products (brand_id,title,price_cents,images,category,source,external_url) values
('10000000-0000-0000-0000-000000000001','Oversized Poplin Shirt',8900,array['https://images.unsplash.com/photo-1605763240000-7e93b172d754'],'Tops','native',null),
('10000000-0000-0000-0000-000000000002','Samba OG',10000,array['https://images.unsplash.com/photo-1549298916-b41d501d3772'],'Sneakers','affiliate','https://example.com'),
('10000000-0000-0000-0000-000000000003','Ribbed Column Dress',21800,array['https://images.unsplash.com/photo-1595777457583-95e059d581b8'],'Dresses','native',null);
