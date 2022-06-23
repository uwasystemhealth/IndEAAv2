from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator


class GroupName:
    ADMIN_GROUP = "superuser"


def django_paginator(model_list, paginate_by, page):
    paginator = Paginator(model_list, paginate_by)
    try:
        paginate_list = paginator.page(page)
    except PageNotAnInteger:
        paginate_list = paginator.page(1)
    except EmptyPage:
        paginate_list = paginator.page(paginator.num_pages)
    return paginate_list
