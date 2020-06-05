$(document).ready(function(){
	//Находим нужные элементы на странице
	var srcValue = $('#imgHolder img').attr('src');
	var carImg = $('#imgHolder img');
	//Заводим необхдимые переменные
	var modelSpecs,
		modelPrice,
		modelPriceUSD,
		modelSpecsHolder,
		modelPriceHolder,
		modelPriceUSDHolder;
	//Присваеваем каждой переменной соответствующий ей элемент на странице
	modelSpecsHolder = $('#modelSpecs');
	modelPriceHolder = $('#modelPrice');
	modelPriceUSDHolder = $('#modelPriceUSD');

	modelPrice = 0;
	modelPriceUSD = 0;
	modelSpecs = '';
	//добавляем ссылку для аякс запроса на получение текущего курса дол. к грн
	var currenceUrl = ' https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
	var rurUsdRate = 0;

	//запрос на ПриватБанк на получение курса валют
	$.ajax({
		url: currenceUrl,
		cache : false,
		success : function(html){
			rurUsdRate = html[0].buy;
			calculatePriceUSD();
		}
	})

	//Изменение картинки машины по клику на елмент
	$('.colorItem').on('click', function(){
		var imgPath = $(this).attr('data-img-path');
		
		$(carImg).fadeOut(500, function(){
			$(carImg).attr('src', imgPath).fadeIn(500);
		});
	});

	//Получаем данные из радиоформ и считаем цену
	function calculatePrice(){
		modelPrice = parseInt($('input[name=engine]:checked', '#autoForm').val());
		modelPrice += parseInt($('input[name=transmission]:checked', '#autoForm').val());
		modelPrice += parseInt($('input[name=package]:checked', '#autoForm').val());

		modelPriceHolder.text(addSpace(modelPrice) + ' гривен');
	};
	//Вывод выбранной комплектации на табле
	function compileSpecs(){
		modelSpecs = $('input[name=engine]:checked + label', '#autoForm').text();
		modelSpecs += ', ' + $('input[name=transmission]:checked + label', '#autoForm').text();
		modelSpecs += ', ' + $('input[name=package]:checked + label', '#autoForm').text();
	
		modelSpecsHolder.text(modelSpecs);
	};
	//Считаем цену в дол. используя текущий курс
	function calculatePriceUSD(){
		modelPriceUSD = modelPrice / rurUsdRate;
		modelPriceUSDHolder.text( '$ ' + addSpace(modelPriceUSD.toFixed(0)));
	}

	//функция табуляции для вывода цены
	function addSpace(nStr){
		nStr += '';
		x = nStr.split('.');

		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;

		while(rgx.test(x1)){
			x1 = x1.replace(rgx, '$1' + ' ' + '$2');
		}

		return x1 + x2; 
	}

	$('#autoForm input').on('change', function(){
		calculatePrice();
		compileSpecs();
		calculatePriceUSD();
	})

	calculatePrice();
	compileSpecs();
})