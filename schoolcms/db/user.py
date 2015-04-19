#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""SchoolCMS db model Announcement.

A model.
"""

from __future__ import absolute_import
from __future__ import print_function
from __future__ import unicode_literals

import random
import hashlib
import string

from . import Base

from sqlalchemy import Column
from sqlalchemy.dialects.drizzle import INTEGER, BOOLEAN, CHAR, VARCHAR, ENUM


try:
    xrange
except NameError:
    xrange = range


class User(Base):
    __tablename__ = 'users'

    id = Column(INTEGER, primary_key=True)
    account = Column(CHAR(20, collation='utf8_unicode_ci'), nullable=False)
    passwd = Column(VARCHAR(90, collation='utf8_unicode_ci'))
    name = Column(VARCHAR(20, collation='utf8_unicode_ci'))
    identity = Column('identity', ENUM('學生','教師', collation='utf8_unicode_ci'), nullable=False)
    isadmin = Column(BOOLEAN, nullable=False)

    def __init__(self, account, passwd, name,
                identity='學生', isadmin=False, **kwargs):
        self.account = account
        self.name = name
        self.identity = identity
        self.isadmin = isadmin
        self.passwd = self.hash_passwd(self.account, passwd)

    @staticmethod
    def make_salt():
        return ''.join(random.choice(string.letters) for i in xrange(5))

    @classmethod
    def hash_passwd(cls, account, passwd, salt=''):
        if not salt:
            salt = cls.make_salt()
        h = hashlib.sha256(account+passwd+salt).hexdigest()
        return '%s,%s'%(h,salt)

    def check_passwd(self, passwd):
        salt = self.passwd.split(',')[1]
        return self.passwd == self.hash_passwd(self.account,passwd,salt)