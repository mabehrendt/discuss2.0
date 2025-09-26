import rules

from adhocracy4.modules import predicates as module_predicates

rules.add_perm(
    'a4_candy_debate_stance.add_aistancesubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_stance.change_aistancesubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_stance.view_aistancesubject',
    (module_predicates.is_allowed_moderate_project |
     module_predicates.is_allowed_view_item)
)

rules.add_perm(
    'a4_candy_debate_stance.comment_aistancesubject',
    module_predicates.is_allowed_comment_item
)
