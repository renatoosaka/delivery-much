# Como executar o backend

- Clone o repositório
- Execute docker-compose up
- A porta utlizada 5000

## Products

`post` - Create a new product

url: `http://localhost:5000/api/products`
#### body
```
{
	"name": "Product",
	"price": 15,
	"quantity": 50
}
```
#### response
```
{
	"name": "Product",
	"price": 15,
	"quantity": 50
}
```

`get` - Show a product

url: `http://localhost:5000/api/products/:name`
#### response
```
{
	"name": "Product",
	"price": 15,
	"quantity": 50
}
```

`patch` - Update product stock

url: `http://localhost:5000/api/products/:name`
#### body
```
{
	"quantity": 10,
	"operation": "increase"
}
```
#### response
```
{
	"name": "Product",
	"price": 15,
	"quantity": 60
}
```

## Orders

`post` - Create a new order

url: `http://localhost:5000/api/orders`
#### body
```
{
	"products": [
		{
			"name": "Product",
			"quantity": 1
		}
	]
}
```
#### response
```
{
  "id": "604232ea04c929003ca50aeb",
  "products": [
    {
      "id": "604231bc2930c6001de3eeb7",
      "name": "Product",
      "price": 15,
      "quantity": 1
    }
  ],
  "total": 15
}
```

`get` - Show all orders

url: `http://localhost:5000/api/orders`

#### response
```
[{
  "id": "604232ea04c929003ca50aeb",
  "products": [
    {
      "id": "604231bc2930c6001de3eeb7",
      "name": "Product",
      "price": 15,
      "quantity": 1
    }
  ],
  "total": 15
}]
```

`get` - Show an specific order

url: `http://localhost:5000/api/orders/:id`

#### response
```
{
  "id": "604232ea04c929003ca50aeb",
  "products": [
    {
      "id": "604231bc2930c6001de3eeb7",
      "name": "Product",
      "price": 15,
      "quantity": 1
    }
  ],
  "total": 15
}
```
