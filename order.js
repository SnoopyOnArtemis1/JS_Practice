"use strict"	
/*取消按鈕、成交按鈕所做的事(於新增訂單時產生)*/	
class NewButton{
	constructor(){
		if(Array.isArray(myarr)==true){//如果localStorage有東西
			this.buttonID=myarr.length-1;
		}
		else{
			this.buttonID=0;
		}

		//取消按鈕
		this.btn1=document.createElement("button");
		this.text1=document.createTextNode("取消");
		this.btn1.setAttribute("id","btn1");
		this.btn1.appendChild(this.text1);

		//成交按鈕
		this.btn2=document.createElement("button");
		this.text2=document.createTextNode("成交");
		this.btn2.setAttribute("id","btn2");
		this.btn2.appendChild(this.text2);
	
		//用<div>把兩個按鈕包起來
		this.aDiv=document.createElement("DIV");
		this.aDiv.appendChild(this.btn1);
		this.aDiv.appendChild(this.btn2);
	}

	//將包著兩個按鈕的div回傳(以插入待出貨table的最後一格)
	addButton(){
		return this.aDiv;
	}

	//取消訂單
	cancelOrder(z){//z為訂單編號
		this.btn1.onclick=function(){
		myarr[z].currentStatus="取消";//將訂單編號z的currentStatus從"待出貨"改為"取消"
		
		/*刪除畫面右邊兩個table(除了表頭)*/
		for (let i = document.getElementById("myTable").rows.length-1;i>0;i--){
			document.getElementById("myTable").deleteRow(1);
		}
		for (let i = document.getElementById("myTable_2").rows.length-1;i>0;i--){
			document.getElementById("myTable_2").deleteRow(1);
		}

		localStorage.setItem("orderList",JSON.stringify(myarr));//更新localStorage(因為訂單編號z的currentStatus從"待出貨"變成"取消")
		displayOrderList(); //讀出更新後的localStorage至使用者畫面上
		swal("成功取消訂單!", "", "success");//sweetAlert彈跳視窗
		}
		
	}

	//訂單成交
	completeOrder(z){//z為訂單編號
		this.btn2.onclick=function(){
		myarr[z].currentStatus="成交";//將訂單編號z的currentStatus從"待出貨"改為"成交"
		
		/*刪除使用者畫面右邊兩個table(除了表頭)*/
		for (let i = document.getElementById("myTable").rows.length-1;i>0;i--){
			document.getElementById("myTable").deleteRow(1);
		}
		for (let i = document.getElementById("myTable_2").rows.length-1;i>0;i--){
			document.getElementById("myTable_2").deleteRow(1);
		}

		localStorage.setItem("orderList",JSON.stringify(myarr));//更新localStorage(因為訂單編號z的currentStatus從"待出貨"變成"成交")
		displayOrderList();//讀出更新後的localStorage至使用者畫面上
		swal("成功!", "交貨完成", "success");//sweetAlert彈跳視窗
		}
	}
}

/*每次重新回到分頁，更新陣列myarr*/ /*array每一格中，存放一筆訂單object*/
let myarr=JSON.parse(localStorage.getItem("orderList"));

/*重讀分頁時，如果localstorage有東西，才執行displayOrderList()*/
if(Array.isArray(myarr)==true){
	displayOrderList();/*重新打開分頁時，在畫面上秀出orderList*/
}
else{
	myarr=[];
}

/*用於增加訂單時*/
/*(1)儲存到localStorage，(2)並更新畫面上的訂單列表*/
	/*(1)儲存到localStorage*/
	function updateOrderList(){
		//a~f為輸入欄位的值
		let a=parseInt(document.getElementById("number_01").value, 10);
		let b=parseInt(document.getElementById("number_02").value, 10);
		let c=parseInt(document.getElementById("number_03").value, 10);
		let d=parseInt(document.getElementById("number_04").value, 10);
		let e=document.getElementById("cusName").value;
		let f=document.getElementById("cusPhone").value;
		let aObject= new Date();
		let orderDate=(aObject.getFullYear()).toString()+"/"+(aObject.getMonth()+1).toString()+"/"+(aObject.getDate()).toString();
		
		/*檢查增減按鈕的input，有無輸入東西 和 輸入的數字是否小於0*/
		if (!(a>=0) || !(b>=0) || !(c>=0) || !(d>=0)){	/*註:不是 >=0 */
			//alert("數量輸入錯誤");
			swal("Oops", "數量輸入錯誤", "error");//sweetAlert彈跳視窗
			reset();//清空輸入欄位
			return
		}

		let totalPrice=addUpTotal();/*計算總價錢的函數*/

		/*確認訂單資訊齊全*/
		if (totalPrice==0){
			//alert("數量不可為0");
			swal("Oops", "數量不可為0", "error");//sweetAlert彈跳視窗
			return
		} 
		else if(e==""){
			//alert("顧客姓名不可空白");
			swal("Oops", "顧客姓名不可空白", "error");//sweetAlert彈跳視窗
			return
		}
		else if(f==""){
			//alert("連絡電話不可空白");
			swal("Oops", "連絡電話不可空白", "error");//sweetAlert彈跳視窗
			return
		}

		//產生訂單物件，包含9個name:產品A~D、顧客姓名、聯絡電話、訂購日期、該筆訂單金額、狀態
		let order={
			itemA:a,
			itemB:b,
			itemC:c,
			itemD:d,
			cusName:e,
			cusPhone:f,
			orderDate:orderDate,
			total:totalPrice,
			currentStatus:"待出貨", /*剛新增的訂單，狀態都為待出貨*/
		};

		myarr.push(order);//將新增的訂單物件push到myarr中
		
		localStorage.setItem("orderList",JSON.stringify(myarr));//更新localStorage
		
		/*(2)更新畫面上的訂單列表*/
		let table = document.getElementById("myTable");
		let row = table.insertRow(1);//插入id為myTable的table(待出貨table)的第一列(不包含表頭)
		let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3);
		let cell5 = row.insertCell(4), cell6 = row.insertCell(5), cell7 = row.insertCell(6), cell8 = row.insertCell(7);
		let cell9 = row.insertCell(8);//cell1~9為插入列的1~9格
		
		cell1.innerHTML = myarr[(myarr.length)-1].itemA;
		cell2.innerHTML = myarr[(myarr.length)-1].itemB;
		cell3.innerHTML = myarr[(myarr.length)-1].itemC;
		cell4.innerHTML = myarr[(myarr.length)-1].itemD;
		cell5.innerHTML = myarr[(myarr.length)-1].cusName;
		cell6.innerHTML = myarr[(myarr.length)-1].cusPhone;
		cell7.innerHTML = myarr[(myarr.length)-1].orderDate;
		cell8.innerHTML = myarr[(myarr.length)-1].total;

		let o=new NewButton;
		cell9.appendChild(o.addButton());//將包有btn1、btn2的aDiv插入待出貨table的最後一格
		reset();//使輸入欄位回到初始狀態
		o.cancelOrder(o.buttonID);//用於當btn1(取消按鈕)被點擊時。傳入的值為訂單編號
		o.completeOrder(o.buttonID);//用於當btn2(成交按鈕)被點擊時。傳入的值為訂單編號
	}

/*重新打開分頁、取消訂單、成交訂單時，在畫面上秀出orderList*/
	function displayOrderList(){

		let table = document.getElementById("myTable");//待出貨table(使用者畫面右上)
		let table_2 = document.getElementById("myTable_2");//歷史訂單紀錄table(使用這畫面右下)
		
		//根據currentStatus為"待出貨"、"取消"、"成交"，來決定插入的table
		for (let i=0;i<myarr.length;i++){
			if (myarr[i].currentStatus == "待出貨"){
				let row = table.insertRow(1);//插入id為myTable的table(待出貨table)的第一列(不包含表頭)
				let cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3);
				let cell5 = row.insertCell(4), cell6 = row.insertCell(5), cell7 = row.insertCell(6), cell8 = row.insertCell(7);
				let cell9 = row.insertCell(8);//cell1~9為插入列的1~9格

				cell1.innerHTML = myarr[i].itemA;
				cell2.innerHTML = myarr[i].itemB;
				cell3.innerHTML = myarr[i].itemC;
				cell4.innerHTML = myarr[i].itemD;
				cell5.innerHTML = myarr[i].cusName;
				cell6.innerHTML = myarr[i].cusPhone;
				cell7.innerHTML = myarr[i].orderDate;
				cell8.innerHTML = myarr[i].total;
				let o_2=new NewButton;
				cell9.appendChild(o_2.addButton());//將包有btn1、btn2的aDiv插入待出貨table的最後一格
				o_2.cancelOrder(i);//用於當btn1(取消按鈕)被點擊時。傳入的值為訂單編號
				o_2.completeOrder(i);//用於當btn2(成交按鈕)被點擊時。傳入的值為訂單編號
			}
			else if(myarr[i].currentStatus == "取消"){
				let row_2 = table_2.insertRow(1);//插入id為myTable_2的table(歷史訂單紀錄table)的第一列(不包含表頭)
				let cell1_2 = row_2.insertCell(0), cell2_2 = row_2.insertCell(1), cell3_2 = row_2.insertCell(2), cell4_2 = row_2.insertCell(3);
				let cell5_2 = row_2.insertCell(4), cell6_2 = row_2.insertCell(5), cell7_2 = row_2.insertCell(6), cell8_2 = row_2.insertCell(7);
				let cell9_2 = row_2.insertCell(8);//cell1_2~cell9_2為插入列的1~9格
	
				cell1_2.innerHTML = myarr[i].itemA;
				cell2_2.innerHTML = myarr[i].itemB;
				cell3_2.innerHTML = myarr[i].itemC;
				cell4_2.innerHTML = myarr[i].itemD;
				cell5_2.innerHTML = myarr[i].cusName;
				cell6_2.innerHTML = myarr[i].cusPhone;
				cell7_2.innerHTML = myarr[i].orderDate;
				cell8_2.innerHTML = myarr[i].total;
				cell9_2.innerHTML = myarr[i].currentStatus;
			}
			else if(myarr[i].currentStatus == "成交"){
				let row_2 = table_2.insertRow(1);//插入id為myTable的table(待出貨table)的第一列(不包含表頭)
				let cell1_2 = row_2.insertCell(0), cell2_2 = row_2.insertCell(1), cell3_2 = row_2.insertCell(2), cell4_2 = row_2.insertCell(3);
				let cell5_2 = row_2.insertCell(4), cell6_2 = row_2.insertCell(5), cell7_2 = row_2.insertCell(6), cell8_2 = row_2.insertCell(7);
				let cell9_2 = row_2.insertCell(8);//cell1_2~cell9_2為插入列的1~9格
	
				cell1_2.innerHTML = myarr[i].itemA;
				cell2_2.innerHTML = myarr[i].itemB;
				cell3_2.innerHTML = myarr[i].itemC;
				cell4_2.innerHTML = myarr[i].itemD;
				cell5_2.innerHTML = myarr[i].cusName;
				cell6_2.innerHTML = myarr[i].cusPhone;
				cell7_2.innerHTML = myarr[i].orderDate;
				cell8_2.innerHTML = myarr[i].total;
				cell9_2.innerHTML = myarr[i].currentStatus;
			}
		}
	}
	
	
/*刪除localstorage，並且刪除畫面上的訂單列表*/
	function clearOrderList(){

		for (let i = document.getElementById("myTable").rows.length-1;i>0;i--){
			document.getElementById("myTable").deleteRow(1);
		}
		for (let i = document.getElementById("myTable_2").rows.length-1;i>0;i--){
			document.getElementById("myTable_2").deleteRow(1);
		}
		myarr=[];/*清空myarr*/
		localStorage.clear();
	}


/*過濾顧客姓名。過濾的結果會顯示在待出貨table(id為myTable)和歷史訂單紀錄table(id為myTable_2)上*/	
	function searchName() {
		let input, filter, table, tr, td, txtValue; //過濾待出貨table(id為myTable)時所用到的變數
		let input_2, filter_2, table_2, tr_2, td_2, txtValue_2; //過濾歷史訂單紀錄table(id為myTable_2)時所用道的變數

		/*待出貨訂單列表的過濾*/
		input = document.getElementById("myInput");
		filter = input.value.toUpperCase();
		table = document.getElementById("myTable");
		tr = table.getElementsByTagName("tr");

		for (let i = 0; i < tr.length; i++) {
			
			td = tr[i].getElementsByTagName("td")[4];
			if (td) {
				txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
				} else {
				tr[i].style.display = "none";
				}
			}
		}

		/*歷史訂單列表的過濾*/
		input_2 = document.getElementById("myInput");
		filter_2 = input_2.value.toUpperCase();
		table_2 = document.getElementById("myTable_2");
		tr_2 = table_2.getElementsByTagName("tr");

		for (let i = 0; i < tr_2.length; i++) {
			td_2 = tr_2[i].getElementsByTagName("td")[4];
			if (td_2) {
				txtValue_2 = td_2.textContent || td_2.innerText;
				if (txtValue_2.toUpperCase().indexOf(filter_2) > -1) {
					tr_2[i].style.display = "";
				} else {
					tr_2[i].style.display = "none";
				}
			}       
		}
		
	  }	

///////////////////////////////////////////////////////////////////////////////////

/*計算總價*/
	function addUpTotal(){
		//a~d為數量欄位的值
		let a=parseInt(document.getElementById("number_01").value, 10);
		let b=parseInt(document.getElementById("number_02").value, 10);
		let c=parseInt(document.getElementById("number_03").value, 10);
		let d=parseInt(document.getElementById("number_04").value, 10);
		let totalPrice=10*a + 15*b + 20*c +25*d;
		return totalPrice;
	}

/*reset輸入資訊*//*(此功能並非刪除localstorage資料)*/
	function reset(){
		document.getElementById("number_01").value=0;
		document.getElementById("number_02").value=0;
		document.getElementById("number_03").value=0;
		document.getElementById("number_04").value=0;
		document.getElementById("cusName").value="";
		document.getElementById("cusPhone").value="";
	}
	  
/*數量增減鍵 - 增加*/
	function increaseValue(k) {//k代表的幾個增減按鈕
		if (k==1){
			let value_01 = parseInt(document.getElementById("number_01").value, 10);
			value_01 = isNaN(value_01) ? 0 : value_01; /*如果是"不是數字"*/
			value_01++;
			document.getElementById("number_01").value = value_01;
		}

		else if (k==2){
			let value_02 = parseInt(document.getElementById("number_02").value, 10);
			value_02 = isNaN(value_02) ? 0 : value_02; /*如果是"不是數字"*/
			value_02++;
			document.getElementById("number_02").value = value_02;
		}

		else if (k==3){
			let value_03 = parseInt(document.getElementById("number_03").value, 10);
			value_03 = isNaN(value_03) ? 0 : value_03; /*如果是"不是數字"*/
			value_03++;
			document.getElementById("number_03").value = value_03;
		}

		else if (k==4){
			let value_04 = parseInt(document.getElementById("number_04").value, 10);
			value_04 = isNaN(value_04) ? 0 : value_04; /*如果是"不是數字"*/
			value_04++;
			document.getElementById("number_04").value = value_04;
		}
	}

/*數量增減鍵 - 減少*/
	function decreaseValue(k) {//k代表的幾個增減按鈕
		if (k==1){
			let value_01 = parseInt(document.getElementById("number_01").value, 10);
			value_01 = isNaN(value_01) ? 0 : value_01; /*如果是"不是數字"*/
			value_01 < 1 ? value_01 = 1 : "";
			value_01--;
			document.getElementById("number_01").value = value_01;
		}

		else if (k==2){
			let value_02 = parseInt(document.getElementById("number_02").value, 10);
			value_02 = isNaN(value_02) ? 0 : value_02; /*如果是"不是數字"*/
			value_02 < 1 ? value_02 = 1 : "";
			value_02--;
			document.getElementById("number_02").value = value_02;
		}

		else if (k==3){
			let value_03 = parseInt(document.getElementById("number_03").value, 10);
			value_03 = isNaN(value_03) ? 0 : value_03; /*如果是"不是數字"*/
			value_03 < 1 ? value_03 = 1 : "";
			value_03--;
			document.getElementById("number_03").value = value_03;
		}

		else if (k==4){
			let value_04 = parseInt(document.getElementById("number_04").value, 10);
			value_04 = isNaN(value_04) ? 0 : value_04; /*如果是"不是數字"*/
			value_04 < 1 ? value_03 = 1 : "";
			value_04--;
			document.getElementById("number_04").value = value_04;
		}
	}
	
	

	




	
    
