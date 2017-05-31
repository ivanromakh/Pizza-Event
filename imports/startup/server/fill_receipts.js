
export default function fillReceipt(orders, username, percents) {
  var receipt = '<table style="background-color: #A6E0f6; border-style: solid; border-radius: 10px; margin: 10px; padding:10px"><tr><td>';
  receipt += '<h> CoWorker ' + username + ' order:</h>';
  var orderPrice = 0;

  for(var x = 0; x < orders.length; x++) {
    receipt += '<p style="margin:0"> Item name: ' + orders[x].name + '</p>';
    receipt += '<p style="margin:0"> Item count: ' + orders[x].count + '</p>';

    var percent = percents.find(function(percent) {
      return percent.name == this.orderName;
    }, { orderName: orders[x].name });
    
    var price = 0;
    if(percent) {
      price = orders[x].price*orders[x].count*percent.percent;
    } else {
      price = (orders[x].price*orders[x].count);
    }
    orderPrice += price;
    receipt += '<p style="margin:0"> Item price: ' + price.toFixed(2) + '</p><br>'; 
  }
  receipt += '<p style="margin:0">Total price: ' + orderPrice.toFixed(2) + '</p>';
  receipt += '</table></tr></td>';
  return { receipt: receipt, orderPrice: orderPrice };
}