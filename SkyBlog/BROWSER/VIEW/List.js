SkyBlog.List = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// category dom
		categoryDom,
		
		// list
		list,
		
		// page numbers
		pageNumbers,
		
		// article doms
		articleDoms = [],
		
		// is contents hiding
		isContentsHiding = false,
		
		// wrapper
		wrapper = DIV({
			style : {
				padding : 10
			},
			c : [categoryDom = DIV({
				style : {
					flt : 'left'
				}
			}), UUI.BUTTON({
				style : {
					flt : 'right',
					color : '#4183c4'
				},
				title : '내용 닫기',
				on : {
					tap : function(e, button) {
						
						if (isContentsHiding !== true) {
						
							EACH(articleDoms, function(articleDom) {
								articleDom.hideContent();
							});
							
							isContentsHiding = true;
							
							button.setTitle('내용 열기');
						
						} else {
							
							EACH(articleDoms, function(articleDom) {
								articleDom.showContent();
							});
							
							isContentsHiding = false;
							
							button.setTitle('내용 닫기');
						}
					}
				}
			}), CLEAR_BOTH(), list = UUI.LIST(), pageNumbers = UUI.LIST(), CLEAR_BOTH()]
		}).appendTo(SkyBlog.Layout.getContent());
		
		inner.on('paramsChange', function(params) {
			
			var
			// category
			category = params.category,
			
			// page
			page = params.page;
			
			categoryDom.empty();
			
			if (category !== undefined) {
				categoryDom.append(category);
				
				GET({
					host : 'tagengine.btncafe.com',
					uri : '__REP_TAG',
					paramStr : 'tag=' + encodeURIComponent(category)
				}, function(tag) {
					if (inner.checkIsClosed() !== true) {
						categoryDom.empty();
						categoryDom.append(tag);
						
						categoryDom.append(A({
							style : {
								marginLeft : 5,
								fontSize : 12,
								color : '#428bca',
								textDecoration : 'none'
							},
							c : '[카테고리 수정]',
							on : {
								tap : function() {
									SkyBlog.ArticleModel.changeCategory({
										originCategory : category,
										newCategory : prompt('새 카테고리를 입력해주세요.')
									}, function(newCategory) {
										SkyBlog.GO('list/' + newCategory + '/1');
									});
								}
							}
						}));
						
						categoryDom.append(CLEAR_BOTH());
					}
				});
			}
			
			if (page === undefined) {
				page = 1;
			} else {
				page = INTEGER(page);
			}
			list.removeAllItems();
			
			articleDoms = [];
			
			SkyBlog.ArticleModel.find({
				filter : {
					category : category
				},
				start : (page - 1) * BROWSER_CONFIG.SkyBlog.listArticleCount,
				count : BROWSER_CONFIG.SkyBlog.listArticleCount
			}, function(articleDataSet) {
				
				if (inner.checkIsClosed() !== true) {
						
					EACH(articleDataSet, function(articleData) {
					
						var
						// article dom
						articleDom = SkyBlog.ArticleDom({
							articleData : articleData,
							isShowCategory : category === undefined
						});
						
						list.addItem({
							key : articleData.id,
							item : LI({
								c : articleDom.getPanel()
							})
						});
						
						articleDoms.push(articleDom);
					});
				}
			});
			
			pageNumbers.removeAllItems();
			
			SkyBlog.ArticleModel.count({
				filter : {
					category : category
				}
			}, function(count) {
				
				if (inner.checkIsClosed() !== true) {
				
					REPEAT((count - 1) / BROWSER_CONFIG.SkyBlog.listArticleCount + 1, function(i) {
					
						pageNumbers.addItem({
							key : i + 1,
							item : LI({
								style : {
									flt : 'left',
									marginRight : 10
								},
								c : A({
									c : i + 1,
									href : SkyBlog.HREF('list/' + (category === undefined ? '' : category + '/') + (i + 1)),
									on : {
										tap : function(e) {
											SkyBlog.GO('list/' + (category === undefined ? '' : category + '/') + (i + 1));
										}
									}
								})
							})
						});
					});
				}
			});
			
			if (category === undefined) {
				TITLE(CONFIG.title);
			} else {
				TITLE(category + ' - ' + CONFIG.title);
			}
		});

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
