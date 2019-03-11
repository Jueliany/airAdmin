layui.extend({
	admin: '{/}../../static/js/admin'
});

layui.use(['form','table','laydate','laypage','element', 'jquery', 'admin'], function() {
	var table = layui.table,
		$ = layui.jquery,
		form = layui.form,
		admin = layui.admin,
		layer = layui.layer,
		aypage= layui.laypage,
		element = layui.element,
		laydate = layui.laydate;
		
		$("#sreach").on('click',function (){
			getDate();
		})
		
		getDate();
		function getDate(){
			var postData = {};
			var node = $("#node").val();
			var start = $("#start").val();
			var end = $("#end").val();
			if(node != ""){
				postData.node = node;
			}
			if(start != ""){
				postData.start = start;
			}
			if(end != ""){
				postData.end = end;
			}
			$.ajax({
				url: "http://192.168.0.233:3000/api/getAirQualityList",
				type: "post",
				contentType: "application/json;charset=utf-8",
				datatype: "jsonp",
				data: JSON.stringify(postData),
				async: true,
				beforeSend: function (request) {
		          indexInit = layer.load(2, {shade: [0.1,'#fff']});
		        },
				success:function(result){
					layer.close(indexInit);
					console.log(result)
					if(result.resultCode == 0){
			            loadData(result.data);
					}else{
						
					}
				}
			});
		}
			


	
	/*
	 *数据表格中form表单元素是动态插入,所以需要更新渲染下
	 * http://www.layui.com/doc/modules/form.html#render
	 * */
	
	$('.demoTable .layui-btn').on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});

	/*用户-删除*/
	window.member_del = function(obj, id) {
		layer.confirm('确认要删除吗？', function(index) {
			//发异步删除数据
			$(obj).parents("tr").remove();
			layer.msg('已删除!', {
				icon: 1,
				time: 1000
			});
		});
	}
	
	function loadData(data){
		for(var i = 0; i < data.length; i++){
			if(data[i].node == 1){
				data[i].node_name = "广州";
			}
		}
		table.render({
			elem: '#articleList',
			cellMinWidth: 40,
			cols: [
				[{
					field: 'node',title: '节点编号',templet: '#usernameTpl'
				}, {
					field: 'node_name',title: '采样节点'
				},{
					field: 'temperature',title: '温度',sort: true
				}, {
					field: 'humidity',title: '湿度',sort: true
				}, {
					field: 'PM',title: 'pm2.5',sort: true
				},{
					field: 'datetime',title: '采样时间',sort: true
				}]
			],
			data: data,
			event: true,
			page: true
		});
	}

});




function delAll(argument) {
	var data = tableCheck.getData();
	layer.confirm('确认要删除吗？' + data, function(index) {
		//捉到所有被选中的，发异步进行删除
		layer.msg('删除成功', {
			icon: 1
		});
		$(".layui-form-checked").not('.header').parents('tr').remove();
	});
}