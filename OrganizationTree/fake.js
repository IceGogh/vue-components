export default [
  {
    'name': '总经办',
    'type': 'department',
    'checked': false,
    'children': [
      {
        'name': '总经理',
        'type': 'human',
        'checked': false,
        'children': []
      },
      {
        'name': '财务总监',
        'type': 'human',
        'checked': false,
        'children': []
      },
      {
        'name': '秘书处',
        'type': 'department',
        'checked': false,
        'children': [
          {
            'name': '秘书1',
            'type': 'human',
            'checked': false,
            'children': []
          },
          {
            'name': '秘书2',
            'type': 'human',
            'checked': false,
            'children': []
          }
        ]
      }
    ]
  },
  {
    'name': '营销中心',
    'type': 'department',
    'checked': false,
    'children': [
      {
        'name': '营销总监',
        'type': 'human',
        'checked': false,
        'children': []
      },
      {
        'name': '营销一部',
        'type': 'department',
        'checked': false,
        'children': [
          {
            'name': '营销一部经理',
            'type': 'human',
            'checked': false,
            'children': []
          },
          {
            'name': '营销员A',
            'type': 'human',
            'checked': false,
            'children': []
          }
        ]
      }
    ]
  },
  {
    'name': '未分组人员',
    'type': 'human',
    'checked': false,
    'children': []
  }
]
