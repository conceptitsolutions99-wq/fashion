#!/usr/bin/env bash
# Downloads curated Unsplash photos into public/ for the Your Fashionista shop.
set -u
mkdir -p public/products public/editorial

dl () { # dl <out-path> <photo-id> <width> <quality>
  local out="$1" id="$2" w="$3" q="$4"
  local url="https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}&fm=jpg"
  local code
  code=$(curl -sL -m 45 -o "$out" -w "%{http_code}" -H "User-Agent: Mozilla/5.0" "$url")
  local size
  size=$(stat -c %s "$out" 2>/dev/null || stat -f %z "$out" 2>/dev/null || echo 0)
  if [ "$code" != "200" ] || [ "$size" -lt 5000 ]; then
    echo "FAIL $code $size $out"
    rm -f "$out"
  else
    echo "OK   $code $((size/1024))KB $out"
  fi
}

W=900; Q=74
H=1800; HQ=78

# ---- WOMEN ----
dl public/products/w-dress-floral.jpg    photo-1762154057377-cc9d3dd6900c $W $Q
dl public/products/w-dress-kaftan.jpg    photo-1753192108753-81be0db2f7fe $W $Q
dl public/products/w-dress-wrap.jpg      photo-1671848633245-79cc98b0dbe8 $W $Q
dl public/products/w-skirt-polka.jpg     photo-1789110519584-ce21260be4e6 $W $Q
dl public/products/w-skirt-feather.jpg   photo-1789110854005-6376fa97be36 $W $Q
dl public/products/w-coat-tan.jpg        photo-1695604461075-482522729a8c $W $Q
dl public/products/w-coat-notch.jpg      photo-1539533113208-f6df8cc8b543 $W $Q
dl public/products/w-bag-satchel.jpg     photo-1605733513597-a8f8341084e6 $W $Q
dl public/products/w-bag-leather.jpg     photo-1759432614301-b75386875a20 $W $Q
dl public/products/w-heels-floral.jpg    photo-1543163521-1bf539c55dd2 $W $Q
dl public/products/w-heels-white.jpg     photo-1535043934128-cf0b28d52f95 $W $Q
dl public/products/w-knit-grey.jpg       photo-1574201635302-388dd92a4c3f $W $Q
dl public/products/w-knit-red.jpg        photo-1608984361471-ff566593088f $W $Q
dl public/products/w-jeans-straight.jpg  photo-1475178626620-a4d074967452 $W $Q
dl public/products/w-jeans-blue.jpg      photo-1541099649105-f69ad21f3246 $W $Q
dl public/products/w-top-blouse-red.jpg  photo-1761117228880-df2425bd70da $W $Q
dl public/products/w-top-tee-white.jpg   photo-1620799139507-2a76f79a2f4d $W $Q
dl public/products/w-blazer-black.jpg    photo-1615898290907-0ad011905389 $W $Q

# ---- MEN ----
dl public/products/m-shirt-oxford.jpg    photo-1602810316693-3667c854239a $W $Q
dl public/products/m-shirt-white.jpg     photo-1621072156002-e2fccdc0b176 $W $Q
dl public/products/m-tee-essential.jpg   photo-1581655353564-df123a1eb820 $W $Q
dl public/products/m-tee-heavy.jpg       photo-1521572163474-6864f9cf17ab $W $Q
dl public/products/m-hoodie-black.jpg    photo-1596075780750-81249df16d19 $W $Q
dl public/products/m-hoodie-white.jpg    photo-1615397587950-3cbb55f95b77 $W $Q
dl public/products/m-jacket-leather.jpg  photo-1614252368727-99517bc90d7b $W $Q
dl public/products/m-jacket-denim.jpg    photo-1516257984-b1b4d707412e $W $Q
dl public/products/m-suit-navy.jpg       photo-1617137968427-85924c800a22 $W $Q
dl public/products/m-suit-black.jpg      photo-1618886614638-80e3c103d31a $W $Q
dl public/products/m-knit-merino.jpg     photo-1671135590215-ded219822a44 $W $Q
dl public/products/m-knit-red.jpg        photo-1642886512785-b5fee9faad7f $W $Q
dl public/products/m-jeans-slim.jpg      photo-1602293589930-45aad59ba3ab $W $Q
dl public/products/m-chino.jpg           photo-1473966968600-fa801b869a1a $W $Q
dl public/products/m-sneaker-low.jpg     photo-1556906781-9a412961c28c $W $Q
dl public/products/m-sneaker-high.jpg    photo-1512374382149-233c42b6a83b $W $Q
dl public/products/m-sneaker-runner.jpg  photo-1560769629-975ec94e6a86 $W $Q

# ---- EDITORIAL / HERO ----
dl public/editorial/hero-main.jpg        photo-1768696083080-15d4218ce844 $H $HQ
dl public/editorial/hero-man.jpg         photo-1661313817350-1fa759c43a3b $H $HQ
dl public/editorial/cat-men.jpg          photo-1617114919297-3c8ddb01f599 1200 76
dl public/editorial/cat-women.jpg        photo-1661389374802-8bc55c1df029 1200 76
dl public/editorial/store.jpg            photo-1664202526047-405824c633e7 1400 76
dl public/editorial/rack.jpg             photo-1769107805465-bfd41863f1a0 1400 76
echo "--- done ---"
